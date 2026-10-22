import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { userValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

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

export const AuthRoutes = router;
