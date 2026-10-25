import type { SubmissionStatus } from "../../types/models";

export interface ICreateSubmissionPayload {
	title: string;
	summary: string;
	description: string;
	repositoryUrl: string;
	liveDemoUrl?: string;
	technologies: string[];
}

export type IUpdateSubmissionPayload = Partial<ICreateSubmissionPayload> & {
	screenshots?: string[];
};

export interface IListQuery {
	page?: number;
	limit?: number;
	status?: SubmissionStatus;
	technology?: string;
	search?: string;
	includeDeleted?: boolean;
	scope?: "pending" | "all";
}

export interface IListResult<T> {
	rows: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
