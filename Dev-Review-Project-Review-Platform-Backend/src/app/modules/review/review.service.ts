import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import type { RequestUser } from "../../middleware/checkAuth";
import { applyTransition } from "../../services/workflow";
import type { NotificationType, SubmissionStatus } from "../../types/models";
import { AppError } from "../../utils/AppError";
import type { ICreateReviewPayload } from "./review.interface";
import httpStatus from "http-status";
import { createNotificationInTx } from "../../services/notification.service";

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
			overallScore: payload.overallScore as never,
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

		return { review, status: toStatus };
	});

	return result;
};

export const ReviewServices = {
	createReview,
};
