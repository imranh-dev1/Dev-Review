import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { ReviewControllers } from "./review.controller";
import { assignmentListQuerySchema, reviewIdParamsSchema } from "./review.validation";

const router = Router();

router.get(
    "/mine",
    authenticate,
    authorize("REVIEWER"),
    validate({ query: assignmentListQuerySchema }),
    ReviewControllers.listMyAssignments,
);

router.patch(
    "/:id/accept",
    authenticate,
    authorize("REVIEWER"),
    validate({ params: reviewIdParamsSchema }),
    ReviewControllers.acceptAssignment,
);

router.patch(
    "/:id/cancel",
    authenticate,
    authorize("ADMIN"),
    validate({ params: reviewIdParamsSchema }),
    ReviewControllers.cancelAssignment,
);

export const AssignmentRoutes = router;
