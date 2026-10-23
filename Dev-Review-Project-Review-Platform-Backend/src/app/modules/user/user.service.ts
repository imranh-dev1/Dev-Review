import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";

import { db } from "../../../prisma/db";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";

type UpdateProfilePayload = {
	name?: string;
};

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

export const UserServices = {
	updateProfile,
};
