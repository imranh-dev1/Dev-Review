import { z } from "zod";

export const notificationListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    unreadOnly: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
});

export const notificationIdParamsSchema = z.object({
    id: z.uuid(),
});
