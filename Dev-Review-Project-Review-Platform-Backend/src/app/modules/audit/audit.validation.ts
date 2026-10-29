import { z } from "zod";

export const listAuditLogsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	action: z
		.enum([
			"CREATE",
			"UPDATE",
			"DELETE",
			"LOGIN",
			"LOGOUT",
			"ASSIGN_REVIEWER",
			"START_REVIEW",
			"SUBMIT_REVIEW",
			"STATUS_CHANGE",
			"USER_STATUS_CHANGE",
			"ROLE_CHANGE",
		])
		.optional(),
	entityType: z
		.enum([
			"USER",
			"SUBMISSION",
			"REVIEW",
			"ASSIGNMENT",
			"NOTIFICATION",
			"SYSTEM",
		])
		.optional(),
	actorId: z.uuid().optional(),
});
