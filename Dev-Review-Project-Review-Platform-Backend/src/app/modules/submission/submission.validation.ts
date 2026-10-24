import z from "zod";

const createSubmissionSchema = z.object({
	data: z.object({
		title: z.string().trim().min(3).max(150),
		summary: z.string().trim().min(10).max(300),
		description: z.string().trim().min(1).max(50000),
		repositoryUrl: z.url().max(2048),
		liveDemoUrl: z.url().max(2048).optional(),
		technologies: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
	}),
});

export const SubmissionValidation = {
	createSubmissionSchema,
};
