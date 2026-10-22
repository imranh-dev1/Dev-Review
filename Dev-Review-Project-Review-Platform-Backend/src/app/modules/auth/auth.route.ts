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

export const AuthRoutes = router;
