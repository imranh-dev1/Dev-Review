import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { NotificationControllers } from "./notification.controller";
import {
    notificationIdParamsSchema,
    notificationListQuerySchema,
} from "./notification.validation";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    validate({ query: notificationListQuerySchema }),
    NotificationControllers.listNotifications,
);

router.get("/unread-count", NotificationControllers.unreadCount);

router.patch("/read-all", NotificationControllers.markAllRead);

router.patch(
    "/:id/read",
    validate({ params: notificationIdParamsSchema }),
    NotificationControllers.markRead,
);

export const NotificationRoutes = router;
