import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { ReviewControllers } from "../review/review.controller";
import {
    assignReviewerSchema,
    createReviewSchema,
    submissionIdParamsSchema,
} from "../review/review.validation";
import { SubmissionControllers } from "./submission.controller";
import {
    createSubmissionSchema,
    idParamsSchema,
    listSubmissionsQuerySchema,
    queueQuerySchema,
    updateSubmissionSchema,
} from "./submission.validation";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    authorize("STUDENT", "ADMIN"),
    validate({ body: createSubmissionSchema }),
    SubmissionControllers.createSubmission,
);

router.get(
    "/mine",
    authorize("STUDENT", "ADMIN"),
    validate({ query: listSubmissionsQuerySchema }),
    SubmissionControllers.listMySubmissions,
);

router.get(
    "/",
    authorize("ADMIN"),
    validate({ query: listSubmissionsQuerySchema }),
    SubmissionControllers.listAllSubmissions,
);

router.get(
    "/queue",
    authorize("REVIEWER"),
    validate({ query: queueQuerySchema }),
    SubmissionControllers.listReviewerQueue,
);

router.get(
    "/:id",
    validate({ params: idParamsSchema }),
    SubmissionControllers.getSubmissionDetail,
);


router.patch(
    "/:id",
    validate({ params: idParamsSchema, body: updateSubmissionSchema }),
    SubmissionControllers.updateSubmission,
);

router.delete(
    "/:id",
    validate({ params: idParamsSchema }),
    SubmissionControllers.softDeleteSubmission,
);

router.post(
    "/:id/submit",
    validate({ params: idParamsSchema }),
    SubmissionControllers.submitSubmission,
);

router.get(
    "/:id/reviews",
    validate({ params: submissionIdParamsSchema }),
    ReviewControllers.listReviews,
);

router.post(
    "/:id/reviews",
    authorize("REVIEWER", "ADMIN"),
    validate({ params: submissionIdParamsSchema, body: createReviewSchema }),
    ReviewControllers.createReview,
);

router.post(
    "/:id/assign",
    authorize("ADMIN"),
    validate({ params: submissionIdParamsSchema, body: assignReviewerSchema }),
    ReviewControllers.assignReviewer,
);

export const SubmissionRoutes = router;
