import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import type { RequestUser } from "../../middleware/checkAuth";
import {
	createAuditLog,
	createAuditLogInTx,
} from "../../services/audit.service";
import { createNotificationInTx } from "../../services/notification.service";
import { applyTransition } from "../../services/workflow";
import type { NotificationType, SubmissionStatus } from "../../types/models";
import { AppError } from "../../utils/AppError";
import { buildMeta, getPagination } from "../../utils/pagination";
import type {
	IAssignmentListQuery,
	ICreateReviewPayload,
	ICriterionPayload,
	IReviewListQuery,
} from "./review.interface";

const DEFAULT_CRITERIA = [
	{
		key: "codeQuality",
		label: "Code Quality",
		description: "Readability, structure, and maintainability of the code.",
		weight: 2,
		sortOrder: 1,
	},
	{
		key: "functionality",
		label: "Functionality",
		description: "Does the project work as described and meet requirements?",
		weight: 2,
		sortOrder: 2,
	},
	{
		key: "uiUx",
		label: "UI / UX",
		description: "Visual design, usability, and overall user experience.",
		weight: 1,
		sortOrder: 3,
	},
	{
		key: "responsiveness",
		label: "Responsiveness",
		description: "Works across desktop, tablet, and mobile screens.",
		weight: 1,
		sortOrder: 4,
	},
	{
		key: "accessibility",
		label: "Accessibility",
		description: "Keyboard navigation, labels, contrast, and semantics.",
		weight: 1,
		sortOrder: 5,
	},
	{
		key: "documentation",
		label: "Documentation",
		description: "README, setup instructions, and project explanation.",
		weight: 1,
		sortOrder: 6,
	},
];

const ensureDefaultCriteria = async () => {
	const { count } = await db.orm.public.ReviewCriterion.aggregate((a) => ({
		count: a.count(),
	}));

	if (count === 0) {
		await Promise.all(
			DEFAULT_CRITERIA.map((criterion) =>
				db.orm.public.ReviewCriterion.create(criterion),
			),
		);
	}
};

const getReviewCriteria = async () => {
	await ensureDefaultCriteria();

	return db.orm.public.ReviewCriterion.where({ isActive: true })
		.orderBy([
			(criterion) => criterion.sortOrder.asc(),
			(criterion) => criterion.createdAt.asc(),
		])
		.all();
};

const listAllCriteria = async () => {
	await ensureDefaultCriteria();

	return db.orm.public.ReviewCriterion.orderBy([
		(criterion) => criterion.sortOrder.asc(),
		(criterion) => criterion.createdAt.asc(),
	]).all();
};

const createCriterion = async (
	actor: RequestUser,
	payload: ICriterionPayload,
) => {
	const criterion = await db.orm.public.ReviewCriterion.create({
		key: payload.key,
		label: payload.label,
		description: payload.description ?? null,
		weight: payload.weight ?? 1,
		sortOrder: payload.sortOrder ?? 0,
	});

	await createAuditLog({
		actorId: actor.userId,
		action: "CREATE",
		entityType: "SYSTEM",
		entityId: criterion.id,
		metadata: { criterionKey: criterion.key },
	});

	return criterion;
};

const updateCriterion = async (
	id: string,
	payload: Partial<ICriterionPayload>,
) => {
	const existing = await db.orm.public.ReviewCriterion.where({ id }).first();

	if (!existing) {
		throw new AppError(httpStatus.NOT_FOUND, "Review criterion not found");
	}

	const update: Record<string, unknown> = {};
	if (payload.key !== undefined) update.key = payload.key;
	if (payload.label !== undefined) update.label = payload.label;
	if (payload.description !== undefined)
		update.description = payload.description || null;
	if (payload.weight !== undefined) update.weight = payload.weight;
	if (payload.sortOrder !== undefined) update.sortOrder = payload.sortOrder;
	if (payload.isActive !== undefined) update.isActive = payload.isActive;

	if (Object.keys(update).length === 0) {
		throw new AppError(httpStatus.BAD_REQUEST, "No fields provided to update");
	}

	return db.orm.public.ReviewCriterion.where({ id }).update(update as never);
};

const deleteCriterion = async (id: string) => {
	const existing = await db.orm.public.ReviewCriterion.where({ id }).first();

	if (!existing) {
		throw new AppError(httpStatus.NOT_FOUND, "Review criterion not found");
	}

	await db.orm.public.ReviewCriterion.where({ id }).delete();

	return { id, deleted: true };
};

const createReview = async (
	submissionId: string,
	user: RequestUser,
	payload: ICreateReviewPayload,
) => {
	const result = await db.transaction(async (tx) => {
		const submission = await tx.orm.public.ProjectSubmission.where({
			id: submissionId,
		})
			.include("assignments", (a) => a.select("id", "reviewerId", "status"))
			.first();

		if (!submission) {
			throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
		}

		const fromStatus = submission.status as SubmissionStatus;
		if (submission.deletedAt || fromStatus !== "IN_REVIEW") {
			throw new AppError(
				httpStatus.CONFLICT,
				"Reviews can only be submitted while the submission is under review",
			);
		}

		const assignment = submission.assignments.find(
			(a) => a.reviewerId === user.userId && a.status !== "CANCELLED",
		);

		if (user.role === "REVIEWER" && !assignment) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You are not assigned to review this submission",
			);
		}

		const countResult = await tx.orm.public.Review.where({
			submissionId,
		}).aggregate((a) => ({ count: a.count() }));
		const revisionNumber = countResult.count + 1;

		const overallScore =
			payload.overallScore ??
			Number(
				(
					(payload.codeQuality +
						payload.functionality +
						payload.uiUx +
						payload.responsiveness +
						payload.accessibility +
						payload.documentation) /
					6
				).toFixed(2),
			);

		const review = await tx.orm.public.Review.create({
			submissionId,
			reviewerId: user.userId,
			decision: payload.decision,
			feedback: payload.feedback,
			codeQuality: payload.codeQuality,
			functionality: payload.functionality,
			uiUx: payload.uiUx,
			responsiveness: payload.responsiveness,
			accessibility: payload.accessibility,
			documentation: payload.documentation,
			overallScore: overallScore as never,
			revisionNumber,
		});

		const toStatus = payload.decision as SubmissionStatus;
		await applyTransition(tx, {
			submissionId,
			fromStatus,
			toStatus,
			changedById: user.userId,
			note: `Review revision ${revisionNumber}: ${payload.decision}`,
		});

		if (assignment) {
			await tx.orm.public.ReviewAssignment.where({ id: assignment.id }).update({
				status: "COMPLETED",
				completedAt: Temporal.Now.instant(),
			});
		}

		await createNotificationInTx(tx, {
			recipientId: submission.ownerId,
			type: "REVIEW_COMPLETED",
			title: "Review completed",
			message: `A review (revision ${revisionNumber}) has been posted on "${submission.title}".`,
			submissionId,
		});

		const decisionNotification: NotificationType =
			payload.decision === "APPROVED"
				? "SUBMISSION_APPROVED"
				: payload.decision === "REJECTED"
					? "SUBMISSION_REJECTED"
					: "CHANGES_REQUESTED";

		const decisionMessage: string =
			payload.decision === "APPROVED"
				? `Your submission "${submission.title}" has been approved.`
				: payload.decision === "REJECTED"
					? `Your submission "${submission.title}" has been rejected.`
					: `Changes were requested on your submission "${submission.title}". Please review the feedback and resubmit.`;

		await createNotificationInTx(tx, {
			recipientId: submission.ownerId,
			type: decisionNotification,
			title:
				decisionNotification === "CHANGES_REQUESTED"
					? "Changes requested"
					: "Submission decision",
			message: decisionMessage,
			submissionId,
		});

		await createAuditLogInTx(tx, {
			actorId: user.userId,
			action: "SUBMIT_REVIEW",
			entityType: "REVIEW",
			entityId: review.id,
			metadata: {
				submissionId,
				decision: payload.decision,
				revisionNumber,
			},
		});

		return { review, status: toStatus };
	});

	return result;
};

const listReviews = async (user: RequestUser, query: IReviewListQuery) => {
	const { page, limit, skip, take } = getPagination(query);

	let reviews = db.orm.public.Review.where({
		...(query.decision ? { decision: query.decision } : {}),
		...(query.submissionId ? { submissionId: query.submissionId } : {}),
		...(query.reviewerId ? { reviewerId: query.reviewerId } : {}),
	});

	if (user.role === "REVIEWER") {
		reviews = reviews.where({ reviewerId: user.userId });
	} else if (user.role === "STUDENT") {
		const owned = await db.orm.public.ProjectSubmission.where({
			ownerId: user.userId,
		})
			.select("id")
			.all();

		const ids = owned.map((submission) => submission.id);

		if (ids.length === 0) {
			return { data: [], meta: buildMeta(page, limit, 0) };
		}

		reviews = reviews.where((review) => review.submissionId.in(ids));
	}

	const { count } = await reviews.aggregate((a) => ({ count: a.count() }));

	const data = await reviews
		.orderBy([
			(review) => review.createdAt.desc(),
			(review) => review.id.desc(),
		])
		.limit(take)
		.offset(skip)
		.include("reviewer", (reviewer) =>
			reviewer.select("id", "name", "email", "avatar"),
		)
		.include("submission", (submission) =>
			submission
				.select("id", "title", "status", "ownerId")
				.include("owner", (owner) => owner.select("id", "name", "email")),
		)
		.all();

	return { data, meta: buildMeta(page, limit, count) };
};

const listAssignments = async (
	user: RequestUser,
	query: IAssignmentListQuery,
) => {
	const { page, limit, skip, take } = getPagination(query);

	let assignments = db.orm.public.ReviewAssignment.where({
		...(query.status ? { status: query.status } : {}),
		...(query.submissionId ? { submissionId: query.submissionId } : {}),
		...(query.reviewerId ? { reviewerId: query.reviewerId } : {}),
	});

	if (user.role === "REVIEWER") {
		assignments = assignments.where({ reviewerId: user.userId });
	}

	const { count } = await assignments.aggregate((a) => ({ count: a.count() }));

	const data = await assignments
		.orderBy([
			(assignment) => assignment.assignedAt.desc(),
			(assignment) => assignment.id.desc(),
		])
		.limit(take)
		.offset(skip)
		.include("reviewer", (reviewer) =>
			reviewer.select("id", "name", "email", "avatar"),
		)
		.include("submission", (submission) =>
			submission
				.select(
					"id",
					"title",
					"summary",
					"status",
					"technologies",
					"submittedAt",
					"createdAt",
				)
				.include("owner", (owner) => owner.select("id", "name", "email")),
		)
		.all();

	return { data, meta: buildMeta(page, limit, count) };
};

const assignReviewer = async (
	submissionId: string,
	actor: RequestUser,
	payload: { reviewerId: string },
) => {
	const result = await db.transaction(async (tx) => {
		const submission = await tx.orm.public.ProjectSubmission.where({
			id: submissionId,
		}).first();

		if (!submission || submission.deletedAt) {
			throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
		}

		if (
			!["SUBMITTED", "IN_REVIEW", "RESUBMITTED"].includes(submission.status)
		) {
			throw new AppError(
				httpStatus.CONFLICT,
				"Only submitted or in-review projects can be assigned to a reviewer",
			);
		}

		const reviewer = await tx.orm.public.User.where({
			id: payload.reviewerId,
		})
			.select("id", "name", "email", "role", "status")
			.first();

		if (reviewer?.role !== "REVIEWER") {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"The selected user is not a reviewer",
			);
		}

		if (reviewer.status !== "ACTIVE") {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"The selected reviewer is not active",
			);
		}

		const existing = await tx.orm.public.ReviewAssignment.where({
			submissionId,
			reviewerId: payload.reviewerId,
		}).first();

		let assignment: { id: string } | null = null;

		if (existing) {
			if (existing.status !== "CANCELLED") {
				throw new AppError(
					httpStatus.CONFLICT,
					"This reviewer is already assigned to the submission",
				);
			}

			assignment = await tx.orm.public.ReviewAssignment.where({
				id: existing.id,
			}).update({
				status: "ASSIGNED",
				assignedAt: Temporal.Now.instant(),
				completedAt: null,
			} as never);
		} else {
			assignment = await tx.orm.public.ReviewAssignment.create({
				submissionId,
				reviewerId: payload.reviewerId,
				status: "ASSIGNED",
			});
		}

		if (!assignment) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Could not create the review assignment",
			);
		}

		await createNotificationInTx(tx, {
			recipientId: payload.reviewerId,
			type: "REVIEW_ASSIGNED",
			title: "New review assigned",
			message: `You have been assigned to review "${submission.title}".`,
			submissionId,
		});

		await createAuditLogInTx(tx, {
			actorId: actor.userId,
			action: "ASSIGN_REVIEWER",
			entityType: "ASSIGNMENT",
			entityId: assignment.id,
			metadata: { submissionId, reviewerId: payload.reviewerId },
		});

		return assignment;
	});

	return result;
};

const startReview = async (submissionId: string, actor: RequestUser) => {
	const result = await db.transaction(async (tx) => {
		const submission = await tx.orm.public.ProjectSubmission.where({
			id: submissionId,
		})
			.include("assignments", (a) =>
				a.select("id", "reviewerId", "status", "assignedAt"),
			)
			.first();

		if (!submission || submission.deletedAt) {
			throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
		}

		const fromStatus = submission.status as SubmissionStatus;

		if (fromStatus !== "SUBMITTED" && fromStatus !== "RESUBMITTED") {
			throw new AppError(
				httpStatus.CONFLICT,
				"Only submitted or resubmitted projects can start review",
			);
		}

		const assignment = submission.assignments.find(
			(item) => item.reviewerId === actor.userId && item.status !== "CANCELLED",
		);

		if (actor.role === "REVIEWER" && !assignment) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You are not assigned to review this submission",
			);
		}

		await applyTransition(tx, {
			submissionId,
			fromStatus,
			toStatus: "IN_REVIEW",
			changedById: actor.userId,
			note: "Review started",
		});

		if (assignment) {
			await tx.orm.public.ReviewAssignment.where({ id: assignment.id }).update({
				status: "ACCEPTED",
			});
		}

		await createNotificationInTx(tx, {
			recipientId: submission.ownerId,
			type: "REVIEW_STARTED",
			title: "Review started",
			message: `A reviewer has started reviewing "${submission.title}".`,
			submissionId,
		});

		await createAuditLogInTx(tx, {
			actorId: actor.userId,
			action: "START_REVIEW",
			entityType: "SUBMISSION",
			entityId: submissionId,
		});

		return { id: submissionId, status: "IN_REVIEW" as SubmissionStatus };
	});

	return result;
};

const acceptAssignment = async (id: string, actor: RequestUser) => {
	const assignment = await db.orm.public.ReviewAssignment.where({ id }).first();

	if (!assignment) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	if (actor.role === "REVIEWER" && assignment.reviewerId !== actor.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You can only accept your own assignments",
		);
	}

	if (assignment.status === "CANCELLED" || assignment.status === "COMPLETED") {
		throw new AppError(
			httpStatus.CONFLICT,
			"This assignment can no longer be accepted",
		);
	}

	const updated = await db.orm.public.ReviewAssignment.where({ id }).update({
		status: "ACCEPTED",
	});

	await createAuditLog({
		actorId: actor.userId,
		action: "UPDATE",
		entityType: "ASSIGNMENT",
		entityId: id,
		metadata: { status: "ACCEPTED" },
	});

	return updated;
};

const cancelAssignment = async (id: string, actor: RequestUser) => {
	const assignment = await db.orm.public.ReviewAssignment.where({ id }).first();

	if (!assignment) {
		throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
	}

	if (assignment.status === "COMPLETED") {
		throw new AppError(
			httpStatus.CONFLICT,
			"Completed assignments cannot be cancelled",
		);
	}

	const updated = await db.orm.public.ReviewAssignment.where({ id }).update({
		status: "CANCELLED",
	});

	await createAuditLog({
		actorId: actor.userId,
		action: "UPDATE",
		entityType: "ASSIGNMENT",
		entityId: id,
		metadata: { status: "CANCELLED" },
	});

	return updated;
};

export const ReviewServices = {
	createReview,
	listReviews,
	listAssignments,
	assignReviewer,
	startReview,
	acceptAssignment,
	cancelAssignment,
	getReviewCriteria,
	listAllCriteria,
	createCriterion,
	updateCriterion,
	deleteCriterion,
};
