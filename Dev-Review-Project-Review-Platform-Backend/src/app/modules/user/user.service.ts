import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";

import { db } from "../../../prisma/db";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import type { IChangePasswordPayload } from "../auth/auth.interface";
import type { RequestUser } from "../../middleware/checkAuth";
import bcrypt from "bcryptjs";
import config from "../../config";
import type { UserListQuery } from "./user.interface";
import { buildMeta, getPagination } from "../../utils/pagination";
import { or } from "@prisma/orm-postgres/orm-client";

type UpdateProfilePayload = {
	name?: string;
};

const USER_PUBLIC_FIELDS = [
	"id",
	"name",
	"email",
	"avatar",
	"role",
	"status",
	"emailVerifiedAt",
	"createdAt",
	"updatedAt",
] as const;

const updateProfile = async (
	userId: string,
	payload: UpdateProfilePayload,
	buffer?: Buffer,
) => {
	const user = await db.orm.public.User.where({
		id: userId,
	}).first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	const updateData: Record<string, unknown> = {};

	const name = payload.name?.trim();

	if (name) {
		updateData.name = name;
	}

	if (buffer) {
		const image = await new Promise<UploadApiResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: "devreview/profiles" }, (error, result) => {
					if (error) return reject(error);

					if (!result) {
						return reject(new Error("Image upload failed."));
					}

					resolve(result);
				})
				.end(buffer);
		});

		updateData.avatar = image.secure_url;
	}

	if (Object.keys(updateData).length === 0) {
		throw new AppError(httpStatus.BAD_REQUEST, "Nothing to update.");
	}

	const updatedUser = await db.orm.public.User.where({
		id: userId,
	}).update(updateData);

	return updatedUser;
};

const changePassword = async (
	user: RequestUser,
	payload: IChangePasswordPayload,
) => {
	const userExist = await db.orm.public.User.where({ id: user.userId }).first();

	if (!userExist || !userExist.passwordHash) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found or password login is not enabled",
		);
	}

	const currentMatches = await bcrypt.compare(
		payload.currentPassword,
		userExist.passwordHash,
	);

	if (!currentMatches) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Current password is incorrect",
		);
	}

	const samePassword = await bcrypt.compare(
		payload.newPassword,
		userExist.passwordHash,
	);

	if (samePassword) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"New password must be different from your current password",
		);
	}

	const saltRounds = Number(config.bcrypt_salt_rounds);

	const hashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

	await db.orm.public.User.where({ id: user.userId }).update({
		passwordHash: hashedPassword,
	});

	return {
		success: true,
		message: "Password updated successfully.",
	};
};


const listUsers = async (query: UserListQuery) => {
	const { page, limit, skip, take } = getPagination(query);

	let users = db.orm.public.User.where({
		...(query.role && { role: query.role }),
		...(query.status && { status: query.status }),
	});

	if (query.search) {
		const term = `%${query.search}%`;

		users = users.where((u) => or(u.name.ilike(term), u.email.ilike(term)),
		);
	}

	const { count } = await users.aggregate((a) => ({
		count: a.count(),
	}));

	const data = await users
		.orderBy([(u) => u.createdAt.desc(), (u) => u.id.desc()])
		.limit(take)
		.offset(skip)
		.select(...USER_PUBLIC_FIELDS)
		.all();

	return {
		data,
		meta: buildMeta(page, limit, count),
	};
};


export const UserServices = {
	updateProfile,
	changePassword,
	listUsers
};
