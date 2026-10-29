import { z } from "zod";

const notificationTypeEnum = z.enum([
	"SUBMISSION_RECEIVED",
	"REVIEW_STARTED",
	"REVIEW_COMPLETED",
	"CHANGES_REQUESTED",
	"SUBMISSION_APPROVED",
	"SUBMISSION_REJECTED",
	"REVIEW_ASSIGNED",
	"SYSTEM",
]);

export const listNotificationsQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	type: notificationTypeEnum.optional(),
	isRead: z
		.enum(["true", "false"])
		.transform((value) => value === "true")
		.optional(),
});

export const notificationIdParamsSchema = z.object({
	id: z.uuid(),
});

export const NotificationValidation = {
	listNotificationsQuerySchema,
	notificationIdParamsSchema,
};
