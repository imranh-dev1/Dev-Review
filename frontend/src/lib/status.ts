import type {
	AssignmentStatus,
	NotificationType,
	ReviewDecision,
	SubmissionStatus,
	UserRole,
	UserStatus,
} from "@/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

interface StatusMeta {
	label: string;
	tone: Tone;
	description: string;
}

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, StatusMeta> = {
	DRAFT: {
		label: "Draft",
		tone: "neutral",
		description: "Not submitted yet. Only you can see this submission.",
	},
	SUBMITTED: {
		label: "Submitted",
		tone: "info",
		description: "Queued for review. A reviewer has not started yet.",
	},
	IN_REVIEW: {
		label: "In review",
		tone: "info",
		description: "A reviewer is actively evaluating this submission.",
	},
	CHANGES_REQUESTED: {
		label: "Changes requested",
		tone: "warning",
		description: "Revise the project using the feedback, then resubmit.",
	},
	RESUBMITTED: {
		label: "Resubmitted",
		tone: "info",
		description: "Resubmitted after changes. Awaiting re-review.",
	},
	APPROVED: {
		label: "Approved",
		tone: "success",
		description: "Meets the evaluation criteria.",
	},
	REJECTED: {
		label: "Rejected",
		tone: "danger",
		description: "Not accepted. See the recorded reason in the review history.",
	},
};

export const REVIEW_DECISION_META: Record<ReviewDecision, StatusMeta> = {
	APPROVED: {
		label: "Approved",
		tone: "success",
		description: "The project meets the review criteria.",
	},
	CHANGES_REQUESTED: {
		label: "Changes requested",
		tone: "warning",
		description: "Revisions are needed before the project can be approved.",
	},
	REJECTED: {
		label: "Rejected",
		tone: "danger",
		description: "The project does not meet the review criteria.",
	},
};

export const ASSIGNMENT_STATUS_META: Record<AssignmentStatus, StatusMeta> = {
	ASSIGNED: {
		label: "Assigned",
		tone: "info",
		description: "Awaiting acceptance by the reviewer.",
	},
	ACCEPTED: {
		label: "Accepted",
		tone: "info",
		description: "The reviewer has started working on it.",
	},
	COMPLETED: {
		label: "Completed",
		tone: "success",
		description: "The review has been submitted.",
	},
	CANCELLED: {
		label: "Cancelled",
		tone: "neutral",
		description: "The assignment was withdrawn.",
	},
};

export const USER_STATUS_META: Record<UserStatus, StatusMeta> = {
	ACTIVE: {
		label: "Active",
		tone: "success",
		description: "Account is in good standing.",
	},
	SUSPENDED: {
		label: "Suspended",
		tone: "warning",
		description: "Access is temporarily blocked.",
	},
	DEACTIVATED: {
		label: "Deactivated",
		tone: "danger",
		description: "The account has been closed.",
	},
};

export const USER_ROLE_META: Record<UserRole, StatusMeta> = {
	STUDENT: {
		label: "Student",
		tone: "neutral",
		description: "Submits and tracks projects.",
	},
	REVIEWER: {
		label: "Reviewer",
		tone: "info",
		description: "Reviews assigned submissions.",
	},
	ADMIN: {
		label: "Administrator",
		tone: "warning",
		description: "Manages the platform.",
	},
};

export const NOTIFICATION_TYPE_META: Record<NotificationType, StatusMeta> = {
	SUBMISSION_RECEIVED: {
		label: "Submission received",
		tone: "info",
		description: "Your submission was queued for review.",
	},
	REVIEW_STARTED: {
		label: "Review started",
		tone: "info",
		description: "A reviewer started evaluating the project.",
	},
	REVIEW_COMPLETED: {
		label: "Review completed",
		tone: "success",
		description: "Feedback was posted on the submission.",
	},
	CHANGES_REQUESTED: {
		label: "Changes requested",
		tone: "warning",
		description: "Revisions are required before resubmission.",
	},
	SUBMISSION_APPROVED: {
		label: "Submission approved",
		tone: "success",
		description: "The project was approved.",
	},
	SUBMISSION_REJECTED: {
		label: "Submission rejected",
		tone: "danger",
		description: "The project was rejected with a recorded reason.",
	},
	REVIEW_ASSIGNED: {
		label: "Review assigned",
		tone: "info",
		description: "You were assigned a submission to review.",
	},
	SYSTEM: {
		label: "System",
		tone: "neutral",
		description: "Platform notification.",
	},
};

export const OPEN_SUBMISSION_STATUSES: SubmissionStatus[] = [
	"SUBMITTED",
	"IN_REVIEW",
	"RESUBMITTED",
	"CHANGES_REQUESTED",
];

export const EDITABLE_SUBMISSION_STATUSES: SubmissionStatus[] = [
	"DRAFT",
	"CHANGES_REQUESTED",
];

export const REVIEW_CRITERIA = [
	{
		key: "codeQuality",
		label: "Code quality",
		hint: "Structure, readability, and idiomatic use.",
	},
	{
		key: "functionality",
		label: "Functionality",
		hint: "Does it do what it claims, reliably?",
	},
	{
		key: "uiUx",
		label: "UI / UX",
		hint: "Clarity, hierarchy, and interaction design.",
	},
	{
		key: "responsiveness",
		label: "Responsiveness",
		hint: "Behaviour across breakpoints and devices.",
	},
	{
		key: "accessibility",
		label: "Accessibility",
		hint: "Keyboard support, contrast, semantics.",
	},
	{
		key: "documentation",
		label: "Documentation",
		hint: "Setup instructions and explanatory depth.",
	},
] as const;

export type ReviewCriterionKey = (typeof REVIEW_CRITERIA)[number]["key"];

export type { StatusMeta };
