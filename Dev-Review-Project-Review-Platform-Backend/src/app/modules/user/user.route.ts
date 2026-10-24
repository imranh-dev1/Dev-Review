import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";
import { UserControllers } from "./user.controller";
import { upload } from "../../lib/multer";
import { userValidation } from "../auth/auth.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { listUsersQuerySchema, updateUserStatusSchema } from "./user.validation";

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

router.get(
	"/all",
	auth(UserRole.ADMIN),
	validateRequest(listUsersQuerySchema),
	UserControllers.listUsers,
);

router.get(
	"/:id",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	UserControllers.getUserDetail,
);

router.patch(
	"/:id/status",
	auth(UserRole.ADMIN),
	validateRequest(updateUserStatusSchema),
	UserControllers.updateUserStatus,
);

router.delete(
	"/:id",
	auth(UserRole.ADMIN),
	UserControllers.deleteUser,
);

export const UserRoutes = router;
