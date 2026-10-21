import { z } from "zod";

export const submissionStatusEnum = z.enum([
    "DRAFT",
    "SUBMITTED",
    "IN_REVIEW",
    "CHANGES_REQUESTED",
    "RESUBMITTED",
    "APPROVED",
    "REJECTED",
]);

const optionalUrl = z
    .union([z.url().max(2048), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value && value !== "" ? value : undefined));

export const createSubmissionSchema = z.object({
    title: z.string().trim().min(3).max(150),
    summary: z.string().trim().min(10).max(300),
    description: z.string().min(1).max(50000),
    repositoryUrl: z.url().max(2048),
    liveDemoUrl: optionalUrl,
    technologies: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
    screenshots: z.array(z.url().max(2048)).max(10).default([]),
});

export const updateSubmissionSchema = createSubmissionSchema.partial();

export const listSubmissionsQuerySchema = z.object({
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

export const queueQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: submissionStatusEnum.optional(),
    technology: z.string().trim().min(1).max(50).optional(),
    search: z.string().trim().max(150).optional(),
    scope: z.enum(["pending", "all"]).optional(),
});

export const idParamsSchema = z.object({
    id: z.uuid(),
});
