import { or } from "@prisma/orm-postgres/orm-client";
import bcrypt from "bcryptjs";
import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { db } from "../../../prisma/db";
import config from "../../config";
import { cloudinary } from "../../lib/cloudinary";
import type { RequestUser } from "../../middleware/checkAuth";
import { createAuditLog } from "../../services/audit.service";
import { UserRole, type UserStatus } from "../../types/models";
import { AppError } from "../../utils/AppError";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { IChangePasswordPayload } from "../auth/auth.interface";
import type { UserListQuery } from "./user.interface";

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

	await createAuditLog({
		actorId: userId,
		action: "UPDATE",
		entityType: "USER",
		entityId: userId,
		metadata: { fields: Object.keys(updateData) },
	});

	return updatedUser;
};

const changePassword = async (
	user: RequestUser,
	payload: IChangePasswordPayload,
) => {
	const userExist = await db.orm.public.User.where({ id: user.userId }).first();

	if (!userExist?.passwordHash) {
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

		users = users.where((u) => or(u.name.ilike(term), u.email.ilike(term)));
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

const getUserDetail = async (id: string) => {
	const user = await db.orm.public.User.where({ id })
		.select(...USER_PUBLIC_FIELDS)
		.first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	const [submissionCountResult, reviewCountResult] = await Promise.all([
		db.orm.public.ProjectSubmission.where({
			ownerId: id,
			deletedAt: null,
		}).aggregate((a) => ({ count: a.count() })),
		db.orm.public.Review.where({ reviewerId: id }).aggregate((a) => ({
			count: a.count(),
		})),
	]);

	return {
		...user,
		counts: {
			submissions: submissionCountResult.count,
			reviews: reviewCountResult.count,
		},
	};
};

const updateUserStatus = async (
	id: string,
	actor: RequestUser,
	status: UserStatus,
) => {
	const user = await db.orm.public.User.where({ id })
		.select("id", "name", "status")
		.first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.id === actor.userId && status !== "ACTIVE") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot change your own account status",
		);
	}

	if (user.status === status) {
		return { id: user.id, status };
	}

	await db.orm.public.User.where({ id }).update({ status });

	await createAuditLog({
		actorId: actor.userId,
		action: "USER_STATUS_CHANGE",
		entityType: "USER",
		entityId: user.id,
		metadata: { fromStatus: user.status, toStatus: status },
	});

	return { id: user.id, status };
};

const updateUserRole = async (
	id: string,
	actor: RequestUser,
	role: UserRole,
) => {
	const user = await db.orm.public.User.where({ id })
		.select("id", "name", "role")
		.first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.role === UserRole.ADMIN) {
		throw new AppError(httpStatus.FORBIDDEN, "Admin role cannot be changed");
	}

	if (user.id === actor.userId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot change your own role",
		);
	}

	if (role !== UserRole.STUDENT && role !== UserRole.REVIEWER) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Only STUDENT and REVIEWER roles are allowed",
		);
	}

	if (user.role === role) {
		return { id: user.id, name: user.name, role };
	}

	await db.orm.public.User.where({ id }).update({ role });

	await createAuditLog({
		actorId: actor.userId,
		action: "ROLE_CHANGE",
		entityType: "USER",
		entityId: user.id,
		metadata: { fromRole: user.role, toRole: role },
	});

	return { id: user.id, name: user.name, role };
};

const deleteUser = async (id: string, actor: RequestUser) => {
	const user = await db.orm.public.User.where({ id })
		.select("id", "name", "status")
		.first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.id === actor.userId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You cannot delete your own account",
		);
	}

	const [submissionCount, reviewCount] = await Promise.all([
		db.orm.public.ProjectSubmission.where({ ownerId: id }).aggregate((a) => ({
			count: a.count(),
		})),
		db.orm.public.Review.where({ reviewerId: id }).aggregate((a) => ({
			count: a.count(),
		})),
	]);

	const hasActivity = submissionCount.count > 0 || reviewCount.count > 0;

	if (hasActivity) {
		await db.orm.public.User.where({ id }).update({
			status: "DEACTIVATED",
		});

		await createAuditLog({
			actorId: actor.userId,
			action: "USER_STATUS_CHANGE",
			entityType: "USER",
			entityId: id,
			metadata: { fromStatus: user.status, toStatus: "DEACTIVATED" },
		});

		return { id, deleted: false, deactivated: true };
	}

	await db.orm.public.User.where({ id }).delete();

	await createAuditLog({
		actorId: actor.userId,
		action: "DELETE",
		entityType: "USER",
		entityId: id,
	});

	return { id, deleted: true, deactivated: false };
};

export const UserServices = {
	updateProfile,
	changePassword,
	listUsers,
	getUserDetail,
	updateUserStatus,
	updateUserRole,
	deleteUser,
};
