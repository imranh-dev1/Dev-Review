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

