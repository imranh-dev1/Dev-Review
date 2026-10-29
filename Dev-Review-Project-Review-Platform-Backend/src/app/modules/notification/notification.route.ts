import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../../types/models";
import { NotificationControllers } from "./notification.controller";
import { NotificationValidation } from "./notification.validation";

const router = Router();

router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	validateRequest(NotificationValidation.listNotificationsQuerySchema),
	NotificationControllers.listNotifications,
);

router.get(
	"/unread-count",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	NotificationControllers.getUnreadCount,
);

router.patch(
	"/read-all",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	NotificationControllers.markAllNotificationsRead,
);

router.patch(
	"/:id/read",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	NotificationControllers.markNotificationRead,
);

export const NotificationRoutes = router;
