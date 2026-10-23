import type { UploadApiResponse } from "cloudinary";
import { db } from "../../../prisma/db";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const updateProfile = async (
	userId: string,
	payload: { name: string },
	buffer?: Buffer,
) => {
	const user = await db.orm.public.User.where({ id: userId }).first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	const data: Record<string, unknown> = {};

	if (payload.name?.trim()) {
		data.name = payload.name.trim();
	}

	if (buffer) {
		const image = await new Promise<UploadApiResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: "devreview/profiles" }, (error, result) => {
					if (error) return reject(error);
					if (!result) return reject(new Error("Image upload failed."));
					resolve(result);
				})
				.end(buffer);
		});

		data.imageUrl = image.secure_url;
		data.imagePublicId = image.public_id;
	}

	if (!Object.keys(data).length) {
		throw new AppError(httpStatus.BAD_REQUEST, "Nothing to update.");
	}

	const updatedUser = await db.orm.public.User.where({
		id: userId,
	}).update({
		name: data.name as string,
		avatar: data.imageUrl as string,
	});

	if (buffer && user.id) {
		await cloudinary.uploader.destroy(user.id);
	}

	return updatedUser;
};

export const UserServices = {
	updateProfile,
};
