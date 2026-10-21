import httpStatus from "http-status";
import { and } from "@prisma/orm-postgres/orm-client";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import { recordAudit } from "../../services/audit.service";
import { createNotificationInTx } from "../../services/notification.service";
import { applyTransition } from "../../services/workflow";
import { AppError } from "../../utils/AppError";
import { asVarchar } from "../../utils/casts";
import { buildMeta, getPagination } from "../../utils/pagination";
import type { AuthUser, SubmissionStatus } from "../../types/models";
import type {
    ICreateSubmissionPayload,
    IListQuery,
    IUpdateSubmissionPayload,
} from "./submission.interface";

const EDITABLE_STATUSES: SubmissionStatus[] = ["DRAFT", "CHANGES_REQUESTED"];
const ASSIGNABLE_STATUSES: SubmissionStatus[] = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"];

const canManage = (ownerId: string, user: AuthUser): boolean =>
    user.role === "ADMIN" || user.id === ownerId;

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, "\\$&");

const idsMatchingTechnology = async (technology: string): Promise<string[]> => {
    const plan = db.raw
        .sql`SELECT id FROM project_submissions WHERE technologies && ARRAY[${technology}]::text[]`
        .returnsRow({ id: "pg/uuid@1" })
        .build();
    const rows = await db.runtime().query(plan);
    return rows.map((row) => row.id);
};

const createSubmission = async (ownerId: string, payload: ICreateSubmissionPayload) => {
    const existing = await db.orm.public.ProjectSubmission.first({
        ownerId,
        repositoryUrl: asVarchar<2048>(payload.repositoryUrl),
    });

    if (existing) {
        throw new AppError(
            httpStatus.CONFLICT,
            "You already have a submission with this repository URL",
        );
    }

    const submission = await db.orm.public.ProjectSubmission.create({
        ownerId,
        title: asVarchar<150>(payload.title),
        summary: asVarchar<300>(payload.summary),
        description: payload.description,
        repositoryUrl: asVarchar<2048>(payload.repositoryUrl),
        ...(payload.liveDemoUrl
            ? { liveDemoUrl: asVarchar<2048>(payload.liveDemoUrl) }
            : {}),
        technologies: [...new Set(payload.technologies)],
        screenshots: payload.screenshots,
        status: "DRAFT",
    });

    await recordAudit({
        actorId: ownerId,
        action: "CREATE",
        entityType: "SUBMISSION",
        entityId: submission.id,
        metadata: { title: payload.title },
    });

    return submission;
};

const getSubmissionDetail = async (id: string, user: AuthUser) => {
    const submission = await db.orm.public.ProjectSubmission
        .where({ id })
        .include("owner", (o) => o.select("id", "name", "email", "avatar"))
        .include("reviews", (r) =>
            r
                .orderBy((x) => x.createdAt.desc())
                .include("reviewer", (rv) => rv.select("id", "name", "email", "avatar")),
        )
        .include("statusHistory", (h) => h.orderBy((x) => x.createdAt.desc()))
        .include("assignments", (a) =>
            a.include("reviewer", (rv) => rv.select("id", "name", "email")),
        )
        .first();

    if (!submission || (submission.deletedAt && user.role !== "ADMIN")) {
        throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
    }

    const isOwner = submission.ownerId === user.id;
    const isAdmin = user.role === "ADMIN";
    const isAssignedReviewer = submission.assignments.some(
        (assignment) => assignment.reviewerId === user.id,
    );

    if (!isOwner && !isAdmin && !isAssignedReviewer) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have access to this submission");
    }

    return submission;
};

const updateSubmission = async (
    id: string,
    user: AuthUser,
    payload: IUpdateSubmissionPayload,
) => {
    const submission = await db.orm.public.ProjectSubmission.where({ id }).first();

    if (!submission || submission.deletedAt) {
        throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
    }

    if (submission.ownerId !== user.id) {
        throw new AppError(httpStatus.FORBIDDEN, "Only the owner can edit this submission");
    }

    if (!EDITABLE_STATUSES.includes(submission.status as SubmissionStatus)) {
        throw new AppError(
            httpStatus.CONFLICT,
            `Only submissions in ${EDITABLE_STATUSES.join(" or ")} status can be edited`,
        );
    }

    if (
        payload.repositoryUrl &&
        payload.repositoryUrl !== submission.repositoryUrl
    ) {
        const duplicate = await db.orm.public.ProjectSubmission.first({
            ownerId: user.id,
            repositoryUrl: asVarchar<2048>(payload.repositoryUrl),
        });
        if (duplicate) {
            throw new AppError(
                httpStatus.CONFLICT,
                "You already have a submission with this repository URL",
            );
        }
    }

    const update: Record<string, unknown> = {};
    if (payload.title !== undefined) update.title = asVarchar<150>(payload.title);
    if (payload.summary !== undefined) update.summary = asVarchar<300>(payload.summary);
    if (payload.description !== undefined) update.description = payload.description;
    if (payload.repositoryUrl !== undefined)
        update.repositoryUrl = asVarchar<2048>(payload.repositoryUrl);
    if (payload.liveDemoUrl !== undefined)
        update.liveDemoUrl = payload.liveDemoUrl
            ? asVarchar<2048>(payload.liveDemoUrl)
            : null;
    if (payload.technologies !== undefined)
        update.technologies = [...new Set(payload.technologies)];
    if (payload.screenshots !== undefined) update.screenshots = payload.screenshots;

    if (Object.keys(update).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "No fields provided to update");
    }

    await db.orm.public.ProjectSubmission.where({ id }).update(update as never);

    await recordAudit({
        actorId: user.id,
        action: "UPDATE",
        entityType: "SUBMISSION",
        entityId: id,
        metadata: { fields: Object.keys(update) },
    });

    return getSubmissionDetail(id, user);
};

const softDeleteSubmission = async (id: string, user: AuthUser) => {
    const submission = await db.orm.public.ProjectSubmission.where({ id }).first();

    if (!submission || submission.deletedAt) {
        throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
    }

    if (!canManage(submission.ownerId, user)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have access to this submission");
    }

    if (submission.status === "IN_REVIEW") {
        throw new AppError(
            httpStatus.CONFLICT,
            "Cannot delete a submission that is under review",
        );
    }

    await db.orm.public.ProjectSubmission.where({ id }).update({
        deletedAt: Temporal.Now.instant(),
    });

    await recordAudit({
        actorId: user.id,
        action: "DELETE",
        entityType: "SUBMISSION",
        entityId: id,
        metadata: { title: submission.title, soft: true },
    });

    return { id, deleted: true };
};

const submitSubmission = async (id: string, user: AuthUser) => {
    const result = await db.transaction(async (tx) => {
        const submission = await tx.orm.public.ProjectSubmission.where({ id }).first();

        if (!submission || submission.deletedAt) {
            throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
        }

        if (submission.ownerId !== user.id) {
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
            changedById: user.id,
            setSubmittedAt: true,
        });

        await createNotificationInTx(tx, {
            recipientId: user.id,
            type: "SUBMISSION_RECEIVED",
            title: "Submission received",
            message: `Your submission "${submission.title}" has been received and is queued for review.`,
            submissionId: id,
        });

        return { id, status: toStatus };
    });

    await recordAudit({
        actorId: user.id,
        action: "STATUS_CHANGE",
        entityType: "SUBMISSION",
        entityId: id,
        metadata: { to: result.status },
    });

    return result;
};

interface ListArgs {
    query: IListQuery;
    filter: {
        ownerId?: string;
        status?: SubmissionStatus;
        deletedAt?: null;
    };
    reviewerId?: string;
}

const listSubmissions = async ({ query, filter, reviewerId }: ListArgs) => {
    const { page, limit, skip, take } = getPagination(query);

    const technologyIds = query.technology
        ? await idsMatchingTechnology(query.technology)
        : null;

    if (technologyIds && technologyIds.length === 0) {
        return { rows: [], meta: buildMeta(page, limit, 0) };
    }

    const assignmentStatuses = query.scope === "all"
        ? ["ASSIGNED", "ACCEPTED", "COMPLETED"]
        : ["ASSIGNED", "ACCEPTED"];

    let base = db.orm.public.ProjectSubmission.where({
        ...filter,
        ...(query.status ? { status: query.status } : {}),
    });

    if (reviewerId) {
        base = base.where((s) =>
            s.assignments.some((a) =>
                and(
                    a.reviewerId.eq(reviewerId),
                    a.status.in(assignmentStatuses as never),
                ),
            ),
        );
    }

    if (technologyIds) {
        base = base.where((s) => s.id.in(technologyIds));
    }

    if (query.search) {
        const term = escapeLike(query.search);
        base = base.where((s) => s.title.ilike(`%${term}%`));
    }

    const countResult = await base.aggregate((a) => ({ count: a.count() }));

    const rows = await base
        .orderBy([(s) => s.createdAt.desc(), (s) => s.id.desc()])
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
            "deletedAt",
        )
        .include("owner", (o) => o.select("id", "name", "email"))
        .all();

    return { rows, meta: buildMeta(page, limit, countResult.count) };
};

const listMySubmissions = async (userId: string, query: IListQuery) =>
    listSubmissions({
        query,
        filter: { ownerId: userId, deletedAt: null },
    });

const listAllSubmissions = async (query: IListQuery) =>
    listSubmissions({
        query,
        filter: query.includeDeleted ? {} : { deletedAt: null },
    });

const listReviewerQueue = async (reviewerId: string, query: IListQuery) =>
    listSubmissions({
        query,
        filter: { deletedAt: null },
        reviewerId,
    });

export const SubmissionServices = {
    createSubmission,
    getSubmissionDetail,
    updateSubmission,
    softDeleteSubmission,
    submitSubmission,
    listMySubmissions,
    listAllSubmissions,
    listReviewerQueue,
    idsMatchingTechnology,
    ASSIGNABLE_STATUSES,
    EDITABLE_STATUSES,
    canManage,
};
