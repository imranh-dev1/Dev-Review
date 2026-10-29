import { db } from "../../../prisma/db";
import {
	AssignmentStatus,
	SubmissionStatus,
	UserRole,
	UserStatus,
} from "../../types/models";

const ALL_SUBMISSION_STATUSES = Object.values(SubmissionStatus);
const ALL_ASSIGNMENT_STATUSES = Object.values(AssignmentStatus);
const ALL_USER_ROLES = Object.values(UserRole);
const ALL_USER_STATUSES = Object.values(UserStatus);

const average = (values: number[]): number | null => {
	if (values.length === 0) return null;

	const total = values.reduce((sum, value) => sum + value, 0);

	return Number((total / values.length).toFixed(2));
};

const getStudentAnalytics = async (userId: string) => {
	const submissions = await db.orm.public.ProjectSubmission.where({
		ownerId: userId,
		deletedAt: null,
	})
		.select("id", "status")
		.all();

	const submissionIds = submissions.map((submission) => submission.id);

	const reviews =
		submissionIds.length > 0
			? await db.orm.public.Review.where((review) =>
					review.submissionId.in(submissionIds),
				)
					.select("overallScore")
					.all()
			: [];

	const byStatus = ALL_SUBMISSION_STATUSES.map((status) => ({
		status,
		count: submissions.filter((submission) => submission.status === status)
			.length,
	}));

	return {
		submissions: {
			total: submissions.length,
			byStatus,
		},
		reviewsReceived: {
			count: reviews.length,
			avgScore: average(reviews.map((review) => Number(review.overallScore))),
		},
	};
};

const getReviewerAnalytics = async (reviewerId: string) => {
	const reviews = await db.orm.public.Review.where({ reviewerId })
		.select("overallScore")
		.all();

	const assignments = await db.orm.public.ReviewAssignment.where({
		reviewerId,
	})
		.select("status")
		.all();

	const byStatus = ALL_ASSIGNMENT_STATUSES.map((status) => ({
		status,
		count: assignments.filter((assignment) => assignment.status === status)
			.length,
	}));

	const pending = assignments.filter(
		(assignment) =>
			assignment.status === AssignmentStatus.ASSIGNED ||
			assignment.status === AssignmentStatus.ACCEPTED,
	).length;

	return {
		reviews: {
			total: reviews.length,
			averageScoreGiven: average(
				reviews.map((review) => Number(review.overallScore)),
			),
		},
		assignments: {
			byStatus,
			pending,
		},
	};
};

const getAdminAnalytics = async () => {
	const users = await db.orm.public.User.select("id", "role", "status").all();

	const submissions = await db.orm.public.ProjectSubmission.where({
		deletedAt: null,
	})
		.select("id", "status", "createdAt")
		.all();

	const reviews = await db.orm.public.Review.select(
		"id",
		"overallScore",
		"createdAt",
	).all();

	const assignments =
		await db.orm.public.ReviewAssignment.select("status").all();

	const notificationCount = await db.orm.public.Notification.aggregate((a) => ({
		count: a.count(),
	}));

	const byRole = ALL_USER_ROLES.map((role) => ({
		role,
		count: users.filter((user) => user.role === role).length,
	}));

	const byUserStatus = ALL_USER_STATUSES.map((status) => ({
		status,
		count: users.filter((user) => user.status === status).length,
	}));

	const bySubmissionStatus = ALL_SUBMISSION_STATUSES.map((status) => ({
		status,
		count: submissions.filter((submission) => submission.status === status)
			.length,
	}));

	const activeAssignments = assignments.filter(
		(assignment) =>
			assignment.status === AssignmentStatus.ASSIGNED ||
			assignment.status === AssignmentStatus.ACCEPTED,
	).length;

	const approved = bySubmissionStatus.find(
		(item) => item.status === SubmissionStatus.APPROVED,
	);

	const reviewedSubmissions = bySubmissionStatus
		.filter(
			(item) =>
				item.status === SubmissionStatus.APPROVED ||
				item.status === SubmissionStatus.REJECTED,
		)
		.reduce((sum, item) => sum + item.count, 0);

	const approvalRate =
		reviewedSubmissions === 0
			? null
			: Number(
					(((approved?.count ?? 0) / reviewedSubmissions) * 100).toFixed(2),
				);

	const recentActivity = await db.orm.public.AuditLog.orderBy((log) =>
		log.createdAt.desc(),
	)
		.limit(10)
		.include("actor", (actor) => actor.select("id", "name", "email", "role"))
		.all();

	return {
		users: {
			total: users.length,
			byRole,
			byStatus: byUserStatus,
		},
		submissions: {
			total: submissions.length,
			byStatus: bySubmissionStatus,
		},
		reviews: {
			total: reviews.length,
			averageScore: average(
				reviews.map((review) => Number(review.overallScore)),
			),
		},
		assignments: { active: activeAssignments },
		notifications: { total: notificationCount.count as number },
		approvalRate,
		recentActivity,
	};
};

export const AnalyticsServices = {
	getStudentAnalytics,
	getReviewerAnalytics,
	getAdminAnalytics,
};
