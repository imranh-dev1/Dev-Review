import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { upload } from "../../lib/multer";
import { SubmissionControllers } from "./submission.controller";

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

export const SubmissionRoutes = router;
