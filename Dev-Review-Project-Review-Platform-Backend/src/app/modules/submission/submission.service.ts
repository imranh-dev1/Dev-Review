import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import { cloudinary } from "../../lib/cloudinary";
import type { RequestUser } from "../../middleware/checkAuth";
import {
	createAuditLog,
	createAuditLogInTx,
} from "../../services/audit.service";
import { createNotificationInTx } from "../../services/notification.service";
import { applyTransition } from "../../services/workflow";
import type { SubmissionStatus } from "../../types/models";
import { AppError } from "../../utils/AppError";
import { buildMeta, getPagination } from "../../utils/pagination";
import type {
	ICreateSubmissionPayload,
	IListQuery,
	IUpdateSubmissionPayload,
} from "./submission.interface";

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

	await createAuditLog({
		actorId: ownerId,
		action: "CREATE",
		entityType: "SUBMISSION",
		entityId: submission.id,
		metadata: { title: submission.title },
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
			submission.title.ilike(`%${query.search?.trim()}%`),
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
	screenshotFiles: Express.Multer.File[],
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

	const {
		repositoryUrl,
		screenshotPreUrls,
		screenshots: _unusedScreenshots,
		...otherPayload
	} = payload;

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

	const existingScreenshots = submission.screenshots ?? [];

	const retainedScreenshots =
		screenshotPreUrls?.filter((url) => existingScreenshots.includes(url)) ?? [];

	const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: "devreview/submissions" }, (error, result) => {
					if (error) {
						return reject(error);
					}

					if (!result) {
						return reject(new Error("Image upload failed."));
					}

					resolve(result);
				})
				.end(buffer);
		});
	};

	const uploadedScreenshots = await Promise.all(
		screenshotFiles.map(async (file) => {
			const image = await uploadImage(file.buffer);
			return image.secure_url;
		}),
	);

	const finalScreenshots = [...retainedScreenshots, ...uploadedScreenshots];

	if (finalScreenshots.length > 5) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"You can have a maximum of 5 screenshots.",
		);
	}

	const update: Record<string, unknown> = {};

	if (otherPayload.title !== undefined) {
		update.title = otherPayload.title;
	}

	if (otherPayload.summary !== undefined) {
		update.summary = otherPayload.summary;
	}

	if (otherPayload.description !== undefined) {
		update.description = otherPayload.description;
	}

	if (repositoryUrl !== undefined) {
		update.repositoryUrl = repositoryUrl;
	}

	if (otherPayload.liveDemoUrl !== undefined) {
		update.liveDemoUrl = otherPayload.liveDemoUrl || null;
	}

	if (otherPayload.technologies !== undefined) {
		update.technologies = [...new Set(otherPayload.technologies)];
	}

	if (Array.isArray(screenshotPreUrls) || screenshotFiles.length > 0) {
		update.screenshots = [...new Set(finalScreenshots)];
	}

	if (Object.keys(update).length === 0) {
		throw new AppError(httpStatus.BAD_REQUEST, "No fields provided to update");
	}

	await db.orm.public.ProjectSubmission.where({ id }).update(update as never);

	await createAuditLog({
		actorId: user.userId,
		action: "UPDATE",
		entityType: "SUBMISSION",
		entityId: id,
		metadata: { fields: Object.keys(update) },
	});

	return getSubmissionDetails(id, user);
};

const deleteSubmission = async (id: string, user: RequestUser) => {
	const submission = await db.orm.public.ProjectSubmission.where({
		id,
	}).first();

	if (!submission || submission.deletedAt) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	if (submission.ownerId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You do not have access to this submission",
		);
	}

	if (submission.status === "IN_REVIEW") {
		throw new AppError(
			httpStatus.CONFLICT,
			"Cannot delete a submission that is under review",
		);
	}

	await db.orm.public.ProjectSubmission.where({ id }).update({
		deletedAt: Temporal.Now.instant(),
	} as never);

	await createAuditLog({
		actorId: user.userId,
		action: "DELETE",
		entityType: "SUBMISSION",
		entityId: id,
	});

	return { id, deleted: true };
};

const submitSubmission = async (id: string, user: RequestUser) => {
	const result = await db.transaction(async (tx) => {
		const submission = await tx.orm.public.ProjectSubmission.where({
			id,
		}).first();

		if (!submission || submission.deletedAt) {
			throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
		}

		if (submission.ownerId !== user.userId) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Only the owner can submit this submission",
			);
		}

		const fromStatus = submission.status as SubmissionStatus;
		let toStatus: SubmissionStatus;

		if (fromStatus === "DRAFT") {
			toStatus = "SUBMITTED";
		} else if (fromStatus === "CHANGES_REQUESTED") {
			toStatus = "RESUBMITTED";
		} else {
			throw new AppError(
				httpStatus.CONFLICT,
				`Only draft or changes-requested submissions can be submitted (current status: ${fromStatus})`,
			);
		}

		await applyTransition(tx, {
			submissionId: id,
			fromStatus,
			toStatus,
			changedById: user.userId,
			setSubmittedAt: true,
		});

		await createNotificationInTx(tx, {
			recipientId: user.userId,
			type: "SUBMISSION_RECEIVED",
			title: "Submission received",
			message: `Your submission "${submission.title}" has been received and is queued for review.`,
			submissionId: id,
		});

		await createAuditLogInTx(tx, {
			actorId: user.userId,
			action: "STATUS_CHANGE",
			entityType: "SUBMISSION",
			entityId: id,
			metadata: { fromStatus, toStatus },
		});

		return { id, status: toStatus };
	});

	return result;
};

export const SubmissionServices = {
	createSubmission,
	listMySubmissions,
	listAllSubmissions,
	listReviewerSubmissions,
	getSubmissionDetails,
	updateSubmission,
	deleteSubmission,
	submitSubmission,
};
