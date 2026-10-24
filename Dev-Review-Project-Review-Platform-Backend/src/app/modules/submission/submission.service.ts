import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";
import type { ICreateSubmissionPayload } from "./submission.interface";
import httpStatus from "http-status";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";

const createSubmission = async (
	ownerId: string,
	screenshotFiles: Express.Multer.File[],
	payload: ICreateSubmissionPayload,
) => {
	const existing = await db.orm.public.ProjectSubmission.first({
		ownerId,
		repositoryUrl: payload.repositoryUrl,
	});

	if (existing) {
		throw new AppError(
			httpStatus.CONFLICT,
			"You already have a submission with this repository URL",
		);
	}

	const screenshotBuffers = screenshotFiles.map((file) => file.buffer);

	const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: "devreview/submissions" }, (error, result) => {
					if (error) return reject(error);

					if (!result) {
						return reject(new Error("Image upload failed."));
					}

					resolve(result);
				})
				.end(buffer);
		});
	};

	const screenshots = await Promise.all(
		screenshotBuffers.map(async (buffer) => {
			const image = await uploadImage(buffer);
			return image.secure_url;
		}),
	);

	const submission = await db.orm.public.ProjectSubmission.create({
		ownerId,
		title: payload.title,
		summary: payload.summary,
		description: payload.description,
		repositoryUrl: payload.repositoryUrl,
		liveDemoUrl: payload.liveDemoUrl,
		technologies: [...new Set(payload.technologies)],
		screenshots: screenshots,
		status: "DRAFT",
	});

	return submission;
};

export const SubmissionServices = {
	createSubmission,
};
