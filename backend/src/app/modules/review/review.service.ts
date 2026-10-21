import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import { recordAudit } from "../../services/audit.service";
import { createNotificationInTx } from "../../services/notification.service";
import { applyTransition } from "../../services/workflow";
import { AppError } from "../../utils/AppError";
import { asNumeric } from "../../utils/casts";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { AuthUser, NotificationType, SubmissionStatus } from "../../types/models";
import type {
    IAssignReviewerPayload,
    IAssignmentListQuery,
    ICreateReviewPayload,
} from "./review.interface";

const ASSIGNABLE_STATUSES: SubmissionStatus[] = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"];

const assertSubmissionVisible = (
    submission: {
        ownerId: string;
        deletedAt: unknown;
        assignments?: { reviewerId: string }[];
    },
    user: AuthUser,
) => {
    if (submission.deletedAt && user.role !== "ADMIN") {
        throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
    }
    const isOwner = submission.ownerId === user.id;
    const isAdmin = user.role === "ADMIN";
    const isAssigned =
        submission.assignments?.some((a) => a.reviewerId === user.id) ?? false;
    if (!isOwner && !isAdmin && !isAssigned) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have access to this submission");
    }
};

const createReview = async (submissionId: string, user: AuthUser, payload: ICreateReviewPayload) => {
    const result = await db.transaction(async (tx) => {
        const submission = await tx.orm.public.ProjectSubmission
            .where({ id: submissionId })
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
            (a) => a.reviewerId === user.id && a.status !== "CANCELLED",
        );

        if (user.role === "REVIEWER" && !assignment) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not assigned to review this submission",
            );
        }

        const countResult = await tx.orm.public.Review
            .where({ submissionId })
            .aggregate((a) => ({ count: a.count() }));
        const revisionNumber = countResult.count + 1;

        const review = await tx.orm.public.Review.create({
            submissionId,
            reviewerId: user.id,
            decision: payload.decision,
            feedback: payload.feedback,
            codeQuality: payload.codeQuality,
            functionality: payload.functionality,
            uiUx: payload.uiUx,
            responsiveness: payload.responsiveness,
            accessibility: payload.accessibility,
            documentation: payload.documentation,
            overallScore: asNumeric<3, 2>(payload.overallScore),
            revisionNumber,
        });

        const toStatus = payload.decision as SubmissionStatus;
        await applyTransition(tx, {
            submissionId,
            fromStatus,
            toStatus,
            changedById: user.id,
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
            title: decisionNotification === "CHANGES_REQUESTED" ? "Changes requested" : "Submission decision",
            message: decisionMessage,
            submissionId,
        });

        return { review, status: toStatus };
    });

    await recordAudit({
        actorId: user.id,
        action: "SUBMIT_REVIEW",
        entityType: "REVIEW",
        entityId: result.review.id,
        metadata: { submissionId, decision: payload.decision },
    });
    await recordAudit({
        actorId: user.id,
        action: "STATUS_CHANGE",
        entityType: "SUBMISSION",
        entityId: submissionId,
        metadata: { to: result.status },
    });

    return result;
};

const listReviews = async (submissionId: string, user: AuthUser) => {
    const submission = await db.orm.public.ProjectSubmission
        .where({ id: submissionId })
        .include("assignments", (a) => a.select("id", "reviewerId"))
        .first();

    if (!submission) {
        throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
    }

    assertSubmissionVisible(submission, user);

    const reviews = await db.orm.public.Review
        .where({ submissionId })
        .orderBy((r) => r.createdAt.desc())
        .include("reviewer", (rv) => rv.select("id", "name", "email", "avatar"))
        .all();

    return reviews;
};

const assignReviewer = async (
    submissionId: string,
    user: AuthUser,
    payload: IAssignReviewerPayload,
) => {
    const result = await db.transaction(async (tx) => {
        const submission = await tx.orm.public.ProjectSubmission.where({ id: submissionId }).first();

        if (!submission || submission.deletedAt) {
            throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
        }

        const fromStatus = submission.status as SubmissionStatus;
        if (!ASSIGNABLE_STATUSES.includes(fromStatus)) {
            throw new AppError(
                httpStatus.CONFLICT,
                "Reviewers can only be assigned to submissions awaiting review",
            );
        }

        const reviewer = await tx.orm.public.User
            .where({ id: payload.reviewerId })
            .select("id", "name", "role", "status")
            .first();

        if (!reviewer) {
            throw new AppError(httpStatus.NOT_FOUND, "Reviewer not found");
        }
        if (reviewer.role !== "REVIEWER") {
            throw new AppError(httpStatus.BAD_REQUEST, "The selected user is not a reviewer");
        }
        if (reviewer.status !== "ACTIVE") {
            throw new AppError(httpStatus.BAD_REQUEST, "The reviewer account is not active");
        }

        const existing = await tx.orm.public.ReviewAssignment.first({
            submissionId,
            reviewerId: payload.reviewerId,
        });

        if (existing) {
            if (existing.status !== "CANCELLED") {
                throw new AppError(
                    httpStatus.CONFLICT,
                    "This reviewer is already assigned to the submission",
                );
            }
            await tx.orm.public.ReviewAssignment.where({ id: existing.id }).update({
                status: "ASSIGNED",
                assignedAt: Temporal.Now.instant(),
                completedAt: null,
            });
        } else {
            await tx.orm.public.ReviewAssignment.create({
                submissionId,
                reviewerId: payload.reviewerId,
                status: "ASSIGNED",
            });
        }

        if (fromStatus === "SUBMITTED" || fromStatus === "RESUBMITTED") {
            await applyTransition(tx, {
                submissionId,
                fromStatus,
                toStatus: "IN_REVIEW",
                changedById: user.id,
                note: `Review assigned to ${reviewer.name}`,
            });
            await createNotificationInTx(tx, {
                recipientId: submission.ownerId,
                type: "REVIEW_STARTED",
                title: "Review started",
                message: `Review of "${submission.title}" has started.`,
                submissionId,
            });
        }

        await createNotificationInTx(tx, {
            recipientId: payload.reviewerId,
            type: "REVIEW_ASSIGNED",
            title: "New review assigned",
            message: `You have been assigned to review "${submission.title}".`,
            submissionId,
        });

        return { submissionId, reviewerId: payload.reviewerId };
    });

    await recordAudit({
        actorId: user.id,
        action: "ASSIGN_REVIEWER",
        entityType: "ASSIGNMENT",
        entityId: result.submissionId,
        metadata: { reviewerId: result.reviewerId },
    });

    return result;
};

const acceptAssignment = async (assignmentId: string, user: AuthUser) => {
    const assignment = await db.orm.public.ReviewAssignment.where({ id: assignmentId }).first();

    if (!assignment) {
        throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    if (assignment.reviewerId !== user.id) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only accept your own assignments");
    }

    if (assignment.status === "CANCELLED") {
        throw new AppError(httpStatus.CONFLICT, "This assignment has been cancelled");
    }

    if (assignment.status !== "ASSIGNED") {
        throw new AppError(httpStatus.CONFLICT, "This assignment has already been accepted");
    }

    await db.orm.public.ReviewAssignment.where({ id: assignmentId }).update({
        status: "ACCEPTED",
    });

    await recordAudit({
        actorId: user.id,
        action: "START_REVIEW",
        entityType: "ASSIGNMENT",
        entityId: assignmentId,
        metadata: { submissionId: assignment.submissionId },
    });

    return { id: assignmentId, status: "ACCEPTED" as const };
};

const cancelAssignment = async (assignmentId: string, user: AuthUser) => {
    const assignment = await db.orm.public.ReviewAssignment.where({ id: assignmentId }).first();

    if (!assignment) {
        throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
    }

    if (assignment.status === "COMPLETED") {
        throw new AppError(httpStatus.CONFLICT, "A completed assignment cannot be cancelled");
    }

    if (assignment.status === "CANCELLED") {
        return { id: assignmentId, status: "CANCELLED" as const };
    }

    await db.orm.public.ReviewAssignment.where({ id: assignmentId }).update({
        status: "CANCELLED",
        completedAt: Temporal.Now.instant(),
    });

    await recordAudit({
        actorId: user.id,
        action: "UPDATE",
        entityType: "ASSIGNMENT",
        entityId: assignmentId,
        metadata: { to: "CANCELLED", submissionId: assignment.submissionId },
    });

    return { id: assignmentId, status: "CANCELLED" as const };
};

const listMyAssignments = async (user: AuthUser, query: IAssignmentListQuery) => {
    const { page, limit, skip, take } = getPagination(query);

    const filter = {
        reviewerId: user.id,
        ...(query.status ? { status: query.status } : {}),
    };

    const countResult = await db.orm.public.ReviewAssignment
        .where(filter)
        .aggregate((a) => ({ count: a.count() }));

    const rows = await db.orm.public.ReviewAssignment
        .where(filter)
        .orderBy((a) => a.assignedAt.desc())
        .limit(take)
        .offset(skip)
        .include("submission", (s) =>
            s
                .select(
                    "id",
                    "title",
                    "summary",
                    "status",
                    "technologies",
                    "submittedAt",
                    "deletedAt",
                )
                .include("owner", (o) => o.select("id", "name", "email")),
        )
        .include("reviewer", (rv) => rv.select("id", "name", "email"))
        .all();

    return { rows, meta: buildMeta(page, limit, countResult.count) };
};

export const ReviewServices = {
    createReview,
    listReviews,
    assignReviewer,
    acceptAssignment,
    cancelAssignment,
    listMyAssignments,
};
