import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { userValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../types/models";

const router = Router();

router.post(
	"/register",
	validateRequest(userValidation.registerSchema),
	AuthControllers.registerUser,
);

router.post(
	"/verify-email",
	validateRequest(userValidation.verifyEmailSchema),
	AuthControllers.verifyEmail,
);

router.post(
	"/resend-otp",
	validateRequest(userValidation.resendOtpSchema),
	AuthControllers.resendOtp,
);

router.post(
	"/login",
	validateRequest(userValidation.loginSchema),
	AuthControllers.loginUser,
);

router.post("/refresh-token", AuthControllers.refreshToken);

router.get(
	"/me",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	AuthControllers.getMe,
);

router.post(
	"/logout",
	auth(UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT),
	AuthControllers.logout,
);

router.post(
	"/forgot-password",
	validateRequest(userValidation.forgotPasswordSchema),
	AuthControllers.forgotPassword,
);

export const AuthRoutes = router;
