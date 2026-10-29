import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../../types/models";
import { ReviewControllers } from "./review.controller";
import {
	assignmentListQuerySchema,
	assignReviewerSchema,
	createCriterionSchema,
	createReviewSchema,
	reviewListQuerySchema,
	updateCriterionSchema,
} from "./review.validation";

const router = Router();

router.get(
	"/reviews",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	validateRequest(reviewListQuerySchema),
	ReviewControllers.listReviews,
);

router.get(
	"/reviews/criteria",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	ReviewControllers.getReviewCriteria,
);

router.post(
	"/submissions/:id/reviews",
	auth(UserRole.ADMIN, UserRole.REVIEWER),
	validateRequest(createReviewSchema),
	ReviewControllers.createReview,
);

router.post(
	"/submissions/:id/assign",
	auth(UserRole.ADMIN),
	validateRequest(assignReviewerSchema),
	ReviewControllers.assignReviewer,
);

router.post(
	"/submissions/:id/start-review",
	auth(UserRole.ADMIN, UserRole.REVIEWER),
	ReviewControllers.startReview,
);

router.get(
	"/assignments",
	auth(UserRole.ADMIN, UserRole.REVIEWER),
	validateRequest(assignmentListQuerySchema),
	ReviewControllers.listAssignments,
);

router.patch(
	"/assignments/:id/accept",
	auth(UserRole.ADMIN, UserRole.REVIEWER),
	ReviewControllers.acceptAssignment,
);

router.patch(
	"/assignments/:id/cancel",
	auth(UserRole.ADMIN),
	ReviewControllers.cancelAssignment,
);

router.get(
	"/admin/review-criteria",
	auth(UserRole.ADMIN),
	ReviewControllers.listAllCriteria,
);

router.post(
	"/admin/review-criteria",
	auth(UserRole.ADMIN),
	validateRequest(createCriterionSchema),
	ReviewControllers.createCriterion,
);

router.patch(
	"/admin/review-criteria/:id",
	auth(UserRole.ADMIN),
	validateRequest(updateCriterionSchema),
	ReviewControllers.updateCriterion,
);

router.delete(
	"/admin/review-criteria/:id",
	auth(UserRole.ADMIN),
	ReviewControllers.deleteCriterion,
);

export const ReviewRoutes = router;

export const AssignmentRoutes = ReviewRoutes;
