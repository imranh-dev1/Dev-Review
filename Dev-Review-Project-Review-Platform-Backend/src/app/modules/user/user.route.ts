import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { UserControllers } from "./user.controller";
import { upload } from "../../lib/multer";
import { userValidation } from "../auth/auth.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { listUsersQuerySchema } from "./user.validation";

const router = Router();

router.patch(
	"/profile-update",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	upload.single("profile-image"),
	UserControllers.updateProfile,
);

router.patch(
	"/me/password",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	validateRequest(userValidation.changePasswordSchema),
	UserControllers.changePassword,
);

router.get("/all", auth(UserRole.ADMIN), validateRequest(listUsersQuerySchema), UserControllers.listUsers);

export const UserRoutes = router;
