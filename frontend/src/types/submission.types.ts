import { SubmissionStatus } from ".";

export interface ICreateSubmissionPayload {
	title: string;
	summary: string;
	description: string;
	repositoryUrl: string;
	liveDemoUrl?: string;
	technologies: string[];
	screenshots: File[];
}

export interface IListQuery {
	page?: number;
	limit?: number;
	status?: SubmissionStatus;
	technology?: string;
	search?: string;
	includeDeleted?: boolean;
	scope?: "pending" | "all";
}
