import z from "zod";

export const submissionStatusEnum = z.enum([
	"DRAFT",
	"SUBMITTED",
	"IN_REVIEW",
	"CHANGES_REQUESTED",
	"RESUBMITTED",
	"APPROVED",
	"REJECTED",
]);

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

const listSubmissionsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: submissionStatusEnum.optional(),
	technology: z.string().trim().min(1).max(50).optional(),
	search: z.string().trim().max(150).optional(),
	includeDeleted: z
		.enum(["true", "false"])
		.transform((value) => value === "true")
		.optional(),
	scope: z.enum(["pending", "all"]).optional(),
});

export const reviewerQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	status: submissionStatusEnum.optional(),
	technology: z.string().trim().min(1).max(50).optional(),
	search: z.string().trim().max(150).optional(),
	scope: z.enum(["pending", "all"]).optional(),
});

export const SubmissionValidation = {
	createSubmissionSchema,
	listSubmissionsQuerySchema,
	reviewerQuerySchema,
};
