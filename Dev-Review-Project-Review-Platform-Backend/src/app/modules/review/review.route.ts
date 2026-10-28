import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { validateRequest } from "../../middleware/validateRequest";
import {
	assignmentListQuerySchema,
	createReviewSchema,
} from "./review.validation";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.post(
	"/:id/reviews",
	auth(UserRole.ADMIN, UserRole.REVIEWER),
	validateRequest(createReviewSchema),
	ReviewControllers.createReview,
);

// router.get(
// 	"/:id/reviews",
// 	auth(UserRole.ADMIN, UserRole.STUDENT),
// 	ReviewControllers.listReviews,
// );

// router.post(
// 	"/:id/assign",
// 	authorize("ADMIN"),
// 	validate({ params: submissionIdParamsSchema, body: assignReviewerSchema }),
// 	ReviewControllers.assignReviewer,
// );

// router.get(
// 	"/",
// 	auth(UserRole.REVIEWER),
// 	validateRequest(assignmentListQuerySchema),
// 	ReviewControllers.listMyAssignments,
// );

// router.patch(
// 	"/:id/accept",
// 	authenticate,
// 	authorize("REVIEWER"),
// 	validate({ params: reviewIdParamsSchema }),
// 	ReviewControllers.acceptAssignment,
// );

// router.patch(
// 	"/:id/cancel",
// 	authenticate,
// 	authorize("ADMIN"),
// 	validate({ params: reviewIdParamsSchema }),
// 	ReviewControllers.cancelAssignment,
// );

export const AssignmentRoutes = router;
