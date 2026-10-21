import httpStatus from "http-status";
import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";

const normalizeAvg = (value: string | number | null): number | null =>
    value === null ? null : Number(value);

const getPlatformStats = async () => {
    const [
        totalUsersResult,
        usersByRole,
        usersByStatus,
        totalSubmissionsResult,
        submissionsByStatus,
        totalReviewsResult,
        reviewStats,
        activeAssignmentsResult,
        totalNotificationsResult,
    ] = await Promise.all([
        db.orm.public.User.aggregate((a) => ({ count: a.count() })),
        db.orm.public.User.groupBy("role").aggregate((a) => ({ count: a.count() })),
        db.orm.public.User.groupBy("status").aggregate((a) => ({ count: a.count() })),
        db.orm.public.ProjectSubmission
            .where((s) => s.deletedAt.isNull())
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.ProjectSubmission
            .where((s) => s.deletedAt.isNull())
            .groupBy("status")
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.Review.aggregate((a) => ({ count: a.count() })),
        db.orm.public.Review.aggregate((a) => ({
            count: a.count(),
            avgScore: a.avg("overallScore"),
        })),
        db.orm.public.ReviewAssignment
            .where((a) => a.status.in(["ASSIGNED", "ACCEPTED"]))
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.Notification.aggregate((a) => ({ count: a.count() })),
    ]);

    return {
        users: {
            total: totalUsersResult.count,
            byRole: usersByRole,
            byStatus: usersByStatus,
        },
        submissions: {
            total: totalSubmissionsResult.count,
            byStatus: submissionsByStatus,
        },
        reviews: {
            total: totalReviewsResult.count,
            averageScore: normalizeAvg(reviewStats.avgScore),
        },
        assignments: {
            active: activeAssignmentsResult.count,
        },
        notifications: {
            total: totalNotificationsResult.count,
        },
    };
};

const getMyStats = async (userId: string) => {
    const [mySubmissions, submissionsByStatus] = await Promise.all([
        db.orm.public.ProjectSubmission
            .where({ ownerId: userId, deletedAt: null })
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.ProjectSubmission
            .where({ ownerId: userId, deletedAt: null })
            .groupBy("status")
            .aggregate((a) => ({ count: a.count() })),
    ]);

    const mySubmissionIds = await db.orm.public.ProjectSubmission
        .where({ ownerId: userId, deletedAt: null })
        .select("id")
        .all();

    const ids = mySubmissionIds.map((row) => row.id);

    let reviewsReceived = { count: 0, avgScore: null as number | null };
    if (ids.length > 0) {
        const aggregateResult = await db.orm.public.Review
            .where((r) => r.submissionId.in(ids))
            .aggregate((a) => ({
                count: a.count(),
                avgScore: a.avg("overallScore"),
            }));
        reviewsReceived = {
            count: aggregateResult.count,
            avgScore: normalizeAvg(aggregateResult.avgScore),
        };
    }

    return {
        submissions: {
            total: mySubmissions.count,
            byStatus: submissionsByStatus,
        },
        reviewsReceived,
    };
};

const getReviewerStats = async (reviewerId: string) => {
    const [reviewStats, assignmentsByStatus, pendingAssignments] = await Promise.all([
        db.orm.public.Review
            .where({ reviewerId })
            .aggregate((a) => ({
                count: a.count(),
                avgScore: a.avg("overallScore"),
            })),
        db.orm.public.ReviewAssignment
            .where({ reviewerId })
            .groupBy("status")
            .aggregate((a) => ({ count: a.count() })),
        db.orm.public.ReviewAssignment
            .where({ reviewerId, status: "ASSIGNED" })
            .aggregate((a) => ({ count: a.count() })),
    ]);

    return {
        reviews: {
            total: reviewStats.count,
            averageScoreGiven: normalizeAvg(reviewStats.avgScore),
        },
        assignments: {
            byStatus: assignmentsByStatus,
            pending: pendingAssignments.count,
        },
    };
};

const assertUser = (userId: string | undefined): string => {
    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return userId;
};

export const AnalyticsServices = {
    getPlatformStats,
    getMyStats,
    getReviewerStats,
    assertUser,
};
