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
export type AssignmentStatus = "ASSIGNED" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
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

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
