import type { SubmissionStatus } from "../../types/models";

export interface ICreateSubmissionPayload {
	title: string;
	summary: string;
	description: string;
	repositoryUrl: string;
	liveDemoUrl?: string;
	technologies: string[];
}

export interface IUpdateSubmissionPayload {
	title?: string;
	summary?: string;
	description?: string;
	repositoryUrl?: string;
	liveDemoUrl?: string | null;
	technologies?: string[];

	screenshotPreUrls?: string[];

	screenshots?: Express.Multer.File[];
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

export interface IListResult<T> {
	rows: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
