import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

router.get(
	"/student",
	auth(UserRole.STUDENT, UserRole.ADMIN),
	AnalyticsControllers.getStudentAnalytics,
);

router.get(
	"/reviewer",
	auth(UserRole.REVIEWER, UserRole.ADMIN),
	AnalyticsControllers.getReviewerAnalytics,
);

router.get(
	"/admin",
	auth(UserRole.ADMIN),
	AnalyticsControllers.getAdminAnalytics,
);

export const AnalyticsRoutes = router;
