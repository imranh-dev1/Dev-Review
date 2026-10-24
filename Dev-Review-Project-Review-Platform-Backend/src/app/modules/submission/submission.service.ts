import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";
import type { ICreateSubmissionPayload, IListQuery } from "./submission.interface";
import httpStatus from "http-status";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { buildMeta, getPagination } from "../../utils/pagination";

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

const listMySubmissions = async (userId: string, query: IListQuery) => {
	const { page, limit, skip, take } = getPagination(query);

	let submissions = db.orm.public.ProjectSubmission.where({
		ownerId: userId,
		deletedAt: null,
		...(query.status ? { status: query.status } : {}),
	});

	if (query.search) {
		submissions = submissions.where((s) =>
			s.title.ilike(`%${query.search}%`),
		);
	}

	const { count } = await submissions.aggregate((a) => ({
		count: a.count(),
	}));

	const data = await submissions
		.orderBy([
			(submission) => submission.createdAt.desc(),
			(submission) => submission.id.desc(),
		])
		.limit(take)
		.offset(skip)
		.select(
			"id",
			"title",
			"summary",
			"status",
			"technologies",
			"repositoryUrl",
			"liveDemoUrl",
			"submittedAt",
			"createdAt",
			"updatedAt",
		)
		.include("owner", (owner) => owner.select("id", "name", "email"))
		.all();

	return {
		data,
		meta: buildMeta(page, limit, count),
	};
};

const listAllSubmissions = async (query: IListQuery) => {
	const { page, limit, skip, take } = getPagination(query);

	let submissions = db.orm.public.ProjectSubmission.where({
		deletedAt: null,
		...(query.status ? { status: query.status } : {}),
	});

	if (query.search) {
		submissions = submissions.where((submission) =>
			submission.title.ilike(`%${query.search}%`),
		);
	}

	const { count } = await submissions.aggregate((a) => ({
		count: a.count(),
	}));

	const data = await submissions
		.orderBy([
			(submission) => submission.createdAt.desc(),
			(submission) => submission.id.desc(),
		])
		.limit(take)
		.offset(skip)
		.select(
			"id",
			"title",
			"summary",
			"status",
			"technologies",
			"repositoryUrl",
			"liveDemoUrl",
			"screenshots",
			"submittedAt",
			"createdAt",
			"updatedAt",
		)
		.include("owner", (owner) => owner.select("id", "name", "email"))
		.all();

	return {
		data,
		meta: buildMeta(page, limit, count),
	};
};
export const SubmissionServices = {
	createSubmission,
	listMySubmissions,
	listAllSubmissions
};
