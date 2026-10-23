import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { validateRequest } from "../../middleware/validateRequest";
import { UserControllers } from "./user.controller";
import { UserProfileValidation } from "./user.validation";
import { upload } from "../../lib/multer";

const router = Router();

router.patch(
	"/profile-update",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	upload.single("profile-image"),
	validateRequest(UserProfileValidation.updateProfileSchema),
	UserControllers.updateProfile,
);

export const UserRoutes = router;
