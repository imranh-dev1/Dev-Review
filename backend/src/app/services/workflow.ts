import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../prisma/db";
import { AppError } from "../utils/AppError";
import type { SubmissionStatus } from "../types/models";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
    DRAFT: ["SUBMITTED"],
    SUBMITTED: ["IN_REVIEW"],
    IN_REVIEW: ["APPROVED", "REJECTED", "CHANGES_REQUESTED"],
    CHANGES_REQUESTED: ["RESUBMITTED"],
    RESUBMITTED: ["IN_REVIEW"],
    APPROVED: [],
    REJECTED: [],
};

export const canTransition = (from: SubmissionStatus, to: SubmissionStatus): boolean =>
    TRANSITIONS[from]?.includes(to) ?? false;

interface TransitionOptions {
    submissionId: string;
    fromStatus: SubmissionStatus;
    toStatus: SubmissionStatus;
    changedById: string | null;
    note?: string;
    setSubmittedAt?: boolean;
}

export const applyTransition = async (tx: Tx, options: TransitionOptions): Promise<void> => {
    const { submissionId, fromStatus, toStatus, changedById, note, setSubmittedAt } = options;

    if (!canTransition(fromStatus, toStatus)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `Invalid status transition from ${fromStatus} to ${toStatus}`,
        );
    }

    const update: { status: SubmissionStatus; submittedAt?: Temporal.Instant } = {
        status: toStatus,
    };
    if (setSubmittedAt) {
        update.submittedAt = Temporal.Now.instant();
    }

    await tx.orm.public.ProjectSubmission.where({ id: submissionId }).update(update);

    await tx.orm.public.SubmissionStatusHistory.create({
        submissionId,
        fromStatus,
        toStatus,
        changedById,
        note: note ?? null,
    });
};
