import { z } from "zod";

export const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    role: z.enum(["STUDENT", "REVIEWER", "ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]).optional(),
    search: z.string().trim().max(255).optional(),
});

export const updateUserStatusSchema = z.object({
    status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]),
});

export const updateUserRoleSchema = z.object({
    role: z.enum(["STUDENT", "REVIEWER", "ADMIN"]),
});

export const userIdParamsSchema = z.object({
    id: z.uuid(),
});

export const createUserSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(72),
    role: z.enum(["STUDENT", "REVIEWER", "ADMIN"]).default("STUDENT"),
});
