export const UserRole = {
	STUDENT: "STUDENT",
	REVIEWER: "REVIEWER",
	ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
	ACTIVE: "ACTIVE",
	SUSPENDED: "SUSPENDED",
	DEACTIVATED: "DEACTIVATED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const SubmissionStatus = {
	DRAFT: "DRAFT",
	SUBMITTED: "SUBMITTED",
	IN_REVIEW: "IN_REVIEW",
	CHANGES_REQUESTED: "CHANGES_REQUESTED",
	RESUBMITTED: "RESUBMITTED",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
} as const;

export type SubmissionStatus =
	(typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const ReviewDecision = {
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
	CHANGES_REQUESTED: "CHANGES_REQUESTED",
} as const;

export type ReviewDecision =
	(typeof ReviewDecision)[keyof typeof ReviewDecision];

export const AssignmentStatus = {
	ASSIGNED: "ASSIGNED",
	ACCEPTED: "ACCEPTED",
	COMPLETED: "COMPLETED",
	CANCELLED: "CANCELLED",
} as const;

export type AssignmentStatus =
	(typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const NotificationType = {
	SUBMISSION_RECEIVED: "SUBMISSION_RECEIVED",
	REVIEW_STARTED: "REVIEW_STARTED",
	REVIEW_COMPLETED: "REVIEW_COMPLETED",
	CHANGES_REQUESTED: "CHANGES_REQUESTED",
	SUBMISSION_APPROVED: "SUBMISSION_APPROVED",
	SUBMISSION_REJECTED: "SUBMISSION_REJECTED",
	REVIEW_ASSIGNED: "REVIEW_ASSIGNED",
	SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
	(typeof NotificationType)[keyof typeof NotificationType];

export const AuditAction = {
	CREATE: "CREATE",
	UPDATE: "UPDATE",
	DELETE: "DELETE",
	LOGIN: "LOGIN",
	LOGOUT: "LOGOUT",
	ASSIGN_REVIEWER: "ASSIGN_REVIEWER",
	START_REVIEW: "START_REVIEW",
	SUBMIT_REVIEW: "SUBMIT_REVIEW",
	STATUS_CHANGE: "STATUS_CHANGE",
	USER_STATUS_CHANGE: "USER_STATUS_CHANGE",
	ROLE_CHANGE: "ROLE_CHANGE",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditEntityType = {
	USER: "USER",
	SUBMISSION: "SUBMISSION",
	REVIEW: "REVIEW",
	ASSIGNMENT: "ASSIGNMENT",
	NOTIFICATION: "NOTIFICATION",
	SYSTEM: "SYSTEM",
} as const;

export type AuditEntityType =
	(typeof AuditEntityType)[keyof typeof AuditEntityType];

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}
