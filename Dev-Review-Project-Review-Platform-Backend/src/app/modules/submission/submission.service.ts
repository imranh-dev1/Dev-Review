import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";
import type {
	ICreateSubmissionPayload,
	IListQuery,
	IUpdateSubmissionPayload,
} from "./submission.interface";
import httpStatus from "http-status";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { RequestUser } from "../../middleware/checkAuth";
import type { SubmissionStatus } from "../../types/models";

const EDITABLE_STATUSES: SubmissionStatus[] = ["DRAFT", "CHANGES_REQUESTED"];

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
		submissions = submissions.where((s) => s.title.ilike(`%${query.search}%`));
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

const idsMatchingTechnology = async (technology: string): Promise<string[]> => {
	const submissions = await db.orm.public.ProjectSubmission.select(
		"id",
		"technologies",
	).all();

	return submissions
		.filter((submission) =>
			submission.technologies.some(
				(item) => item.toLowerCase() === technology.toLowerCase(),
			),
		)
		.map((submission) => submission.id);
};

const listReviewerSubmissions = async (
	query: IListQuery,
	reviewerId: string,
) => {
	const { page, limit, skip, take } = getPagination(query);

	const technologyIds = query.technology
		? await idsMatchingTechnology(query.technology)
		: null;

	if (technologyIds && technologyIds.length === 0) {
		return {
			data: [],
			meta: buildMeta(page, limit, 0),
		};
	}

	const assignmentStatuses =
		query.scope === "all"
			? ["ASSIGNED", "ACCEPTED", "COMPLETED"]
			: ["ASSIGNED", "ACCEPTED"];

	let submissions = db.orm.public.ProjectSubmission.where({
		deletedAt: null,
		...(query.status ? { status: query.status } : {}),
	});

	submissions = submissions.where((submission) =>
		submission.assignments.some(
			(assignment) =>
				assignment.reviewerId.eq(reviewerId) &&
				assignment.status.in(assignmentStatuses as never),
		),
	);

	if (technologyIds) {
		submissions = submissions.where((submission) =>
			submission.id.in(technologyIds),
		);
	}

	if (query.search?.trim()) {
		submissions = submissions.where((submission) =>
			submission.title.ilike(`% ${query.search!.trim()}% `),
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

const getSubmissionDetails = async (id: string, user: RequestUser) => {
	const submission = await db.orm.public.ProjectSubmission.where({ id })
		.include("owner", (o) => o.select("id", "name", "email", "avatar"))
		.include("reviews", (r) =>
			r
				.orderBy((x) => x.createdAt.desc())
				.include("reviewer", (rv) =>
					rv.select("id", "name", "email", "avatar"),
				),
		)
		.include("statusHistory", (h) => h.orderBy((x) => x.createdAt.desc()))
		.include("assignments", (a) =>
			a.include("reviewer", (rv) => rv.select("id", "name", "email")),
		)
		.first();

	if (!submission || (submission.deletedAt && user.role !== "ADMIN")) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	const isOwner = submission.ownerId === user.userId;
	const isAdmin = user.role === "ADMIN";
	const isAssignedReviewer = submission.assignments.some(
		(assignment) => assignment.reviewerId === user.userId,
	);

	if (!isOwner && !isAdmin && !isAssignedReviewer) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You do not have access to this submission",
		);
	}

	return submission;
};

const updateSubmission = async (
	id: string,
	user: RequestUser,
	payload: IUpdateSubmissionPayload,
) => {
	const submission = await db.orm.public.ProjectSubmission.where({
		id,
	}).first();

	if (!submission || submission.deletedAt) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	if (submission.ownerId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only the owner can edit this submission",
		);
	}

	const status = submission.status as SubmissionStatus;

	if (!EDITABLE_STATUSES.includes(status)) {
		throw new AppError(
			httpStatus.CONFLICT,
			`Only submissions in ${EDITABLE_STATUSES.join(" or ")} status can be edited`,
		);
	}

	const { repositoryUrl } = payload;

	if (repositoryUrl && repositoryUrl !== submission.repositoryUrl) {
		const duplicate = await db.orm.public.ProjectSubmission.first({
			ownerId: user.userId,
			repositoryUrl,
		});

		if (duplicate) {
			throw new AppError(
				httpStatus.CONFLICT,
				"You already have a submission with this repository URL",
			);
		}
	}

	const update: Record<string, unknown> = {};

	if (payload.title !== undefined) {
		update.title = payload.title;
	}

	if (payload.summary !== undefined) {
		update.summary = payload.summary;
	}

	if (payload.description !== undefined) {
		update.description = payload.description;
	}

	if (payload.repositoryUrl !== undefined) {
		update.repositoryUrl = payload.repositoryUrl;
	}

	if (payload.liveDemoUrl !== undefined) {
		update.liveDemoUrl = payload.liveDemoUrl || null;
	}

	if (payload.technologies !== undefined) {
		update.technologies = [...new Set(payload.technologies)];
	}

	if (payload.screenshots !== undefined) {
		update.screenshots = payload.screenshots;
	}

	if (Object.keys(update).length === 0) {
		throw new AppError(httpStatus.BAD_REQUEST, "No fields provided to update");
	}

	await db.orm.public.ProjectSubmission.where({ id }).update(update as never);

	return getSubmissionDetails(id, user);
};

export const SubmissionServices = {
	createSubmission,
	listMySubmissions,
	listAllSubmissions,
	listReviewerSubmissions,
	getSubmissionDetails,
	updateSubmission,
};
