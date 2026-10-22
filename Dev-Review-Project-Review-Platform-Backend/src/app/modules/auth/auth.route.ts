import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { userValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/register", validateRequest(userValidation.registerSchema), AuthControllers.registerUser);

export const AuthRoutes = router;
