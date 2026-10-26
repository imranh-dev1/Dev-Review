import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { upload } from "../../lib/multer";
import { SubmissionControllers } from "./submission.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { SubmissionValidation } from "./submission.validation";

const router = Router();

router.post(
	"/",
	auth(UserRole.STUDENT, UserRole.ADMIN),
	upload.fields([
		{ name: "screenshots", maxCount: 5 },
		{ name: "data", maxCount: 1 },
	]),
	SubmissionControllers.createSubmission,
);

router.get(
	"/my",
	auth(UserRole.STUDENT, UserRole.ADMIN),
	validateRequest(SubmissionValidation.listSubmissionsQuerySchema),
	SubmissionControllers.listMySubmissions,
);

router.get(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(SubmissionValidation.listSubmissionsQuerySchema),
	SubmissionControllers.listAllSubmissions,
);

router.get(
	"/reviewer",
	auth(UserRole.REVIEWER),
	validateRequest(SubmissionValidation.reviewerQuerySchema),
	SubmissionControllers.listReviewerSubmissions,
);

router.get(
	"/:id",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	SubmissionControllers.getSubmissionDetails,
);

router.patch(
	"/:id",
	auth(UserRole.STUDENT, UserRole.ADMIN),
	// validateRequest(SubmissionValidation.updateSubmissionSchema),
	upload.fields([
		{ name: "screenshots", maxCount: 5 },
		{ name: "data", maxCount: 1 },
	]),
	SubmissionControllers.updateSubmission,
);

export const SubmissionRoutes = router;
