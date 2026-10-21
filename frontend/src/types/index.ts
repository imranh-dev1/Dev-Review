export type UserRole = "STUDENT" | "REVIEWER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export type SubmissionStatus =
	| "DRAFT"
	| "SUBMITTED"
	| "IN_REVIEW"
	| "CHANGES_REQUESTED"
	| "RESUBMITTED"
	| "APPROVED"
	| "REJECTED";

export type ReviewDecision = "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";

export type AssignmentStatus =
	| "ASSIGNED"
	| "ACCEPTED"
	| "COMPLETED"
	| "CANCELLED";

export type NotificationType =
	| "SUBMISSION_RECEIVED"
	| "REVIEW_STARTED"
	| "REVIEW_COMPLETED"
	| "CHANGES_REQUESTED"
	| "SUBMISSION_APPROVED"
	| "SUBMISSION_REJECTED"
	| "REVIEW_ASSIGNED"
	| "SYSTEM";

export type AuditAction =
	| "CREATE"
	| "UPDATE"
	| "DELETE"
	| "LOGIN"
	| "LOGOUT"
	| "ASSIGN_REVIEWER"
	| "START_REVIEW"
	| "SUBMIT_REVIEW"
	| "STATUS_CHANGE"
	| "USER_STATUS_CHANGE"
	| "ROLE_CHANGE";

export type AuditEntityType =
	| "USER"
	| "SUBMISSION"
	| "REVIEW"
	| "ASSIGNMENT"
	| "NOTIFICATION"
	| "SYSTEM";

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface User {
	id: string;
	name: string;
	email: string;
	avatar: string | null;
	role: UserRole;
	status: UserStatus;
	emailVerifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PublicUser {
	id: string;
	name: string;
	email: string;
	avatar?: string | null;
}

export interface Submission {
	id: string;
	title: string;
	summary: string;
	description?: string;
	repositoryUrl: string;
	liveDemoUrl: string | null;
	technologies: string[];
	screenshots: string[];
	status: SubmissionStatus;
	ownerId: string;
	owner?: PublicUser;
	submittedAt: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface Review {
	id: string;
	submissionId: string;
	reviewerId: string;
	reviewer?: PublicUser;
	decision: ReviewDecision;
	feedback: string;
	codeQuality: number;
	functionality: number;
	uiUx: number;
	responsiveness: number;
	accessibility: number;
	documentation: number;
	overallScore: number | string;
	revisionNumber: number;
	createdAt: string;
}

export interface StatusHistoryEntry {
	id: string;
	submissionId: string;
	fromStatus: SubmissionStatus | null;
	toStatus: SubmissionStatus;
	changedById: string | null;
	note: string | null;
	createdAt: string;
}

export interface Assignment {
	id: string;
	submissionId: string;
	reviewerId: string;
	status: AssignmentStatus;
	assignedAt: string;
	completedAt: string | null;
	submission?: Partial<Submission> & { owner?: PublicUser };
	reviewer?: PublicUser;
}

export interface SubmissionDetail extends Submission {
	reviews: Review[];
	statusHistory: StatusHistoryEntry[];
	assignments: Assignment[];
}

export interface AppNotification {
	id: string;
	recipientId: string;
	submissionId: string | null;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	readAt: string | null;
	createdAt: string;
}

export interface AuditLog {
	id: string;
	actorId: string | null;
	action: AuditAction;
	entityType: AuditEntityType;
	entityId: string | null;
	metadata: string | null;
	createdAt: string;
	actor?: PublicUser | null;
}

export interface PlatformAnalytics {
	users: {
		total: number;
		byRole: { role: UserRole; count: number }[];
		byStatus: { status: UserStatus; count: number }[];
	};
	submissions: {
		total: number;
		byStatus: { status: SubmissionStatus; count: number }[];
	};
	reviews: { total: number; averageScore: number | null };
	assignments: { active: number };
	notifications: { total: number };
}

export interface MyAnalytics {
	submissions: {
		total: number;
		byStatus: { status: SubmissionStatus; count: number }[];
	};
	reviewsReceived: { count: number; avgScore: number | null };
}

export interface ReviewerAnalytics {
	reviews: { total: number; averageScoreGiven: number | null };
	assignments: {
		byStatus: { status: AssignmentStatus; count: number }[];
		pending: number;
	};
}

export interface UserWithCounts extends User {
	counts: { submissions: number; reviews: number };
}

export interface AuthPayload {
	user: User;
	accessToken: string;
}
