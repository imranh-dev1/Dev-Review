import type { AssignmentStatus, ReviewDecision } from "../../types/models";

export interface ICreateReviewPayload {
	decision: ReviewDecision;
	feedback: string;
	codeQuality: number;
	functionality: number;
	uiUx: number;
	responsiveness: number;
	accessibility: number;
	documentation: number;
	overallScore?: number;
}

export interface IAssignReviewerPayload {
	reviewerId: string;
}

export interface IAssignmentListQuery {
	page?: number;
	limit?: number;
	status?: AssignmentStatus;
	submissionId?: string;
	reviewerId?: string;
}

export interface IReviewListQuery {
	page?: number;
	limit?: number;
	decision?: ReviewDecision;
	submissionId?: string;
	reviewerId?: string;
}

export interface ICriterionPayload {
	key: string;
	label: string;
	description?: string;
	weight?: number;
	sortOrder?: number;
	isActive?: boolean;
}
