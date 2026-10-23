import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { UserControllers } from "./user.controller";
import { upload } from "../../lib/multer";

const router = Router();

router.patch(
	"/profile-update",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	upload.single("profile-image"),
	UserControllers.updateProfile,
);

export const UserRoutes = router;
