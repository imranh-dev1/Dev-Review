export interface ICreateSubmissionPayload {
	title: string;
	summary: string;
	description: string;
	repositoryUrl: string;
	liveDemoUrl?: string;
	technologies: string[];
	screenshots: File[];
}
