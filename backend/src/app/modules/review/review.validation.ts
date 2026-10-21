import { z } from "zod";

const scoreField = z.number().int().min(0).max(10);

export const createReviewSchema = z.object({
    decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
    feedback: z.string().trim().min(10).max(10000),
    codeQuality: scoreField,
    functionality: scoreField,
    uiUx: scoreField,
    responsiveness: scoreField,
    accessibility: scoreField,
    documentation: scoreField,
    overallScore: z.number().min(0).max(10),
});

export const assignReviewerSchema = z.object({
    reviewerId: z.uuid(),
});

export const assignmentListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["ASSIGNED", "ACCEPTED", "COMPLETED", "CANCELLED"]).optional(),
});

export const reviewIdParamsSchema = z.object({
    id: z.uuid(),
});

export const submissionIdParamsSchema = z.object({
    id: z.uuid(),
});
