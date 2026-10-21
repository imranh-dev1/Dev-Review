import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

router.use(authenticate);

router.get("/platform", authorize("ADMIN"), AnalyticsControllers.getPlatformStats);

router.get("/me", authorize("STUDENT", "ADMIN"), AnalyticsControllers.getMyStats);

router.get("/reviewer", authorize("REVIEWER"), AnalyticsControllers.getReviewerStats);

export const AnalyticsRoutes = router;
