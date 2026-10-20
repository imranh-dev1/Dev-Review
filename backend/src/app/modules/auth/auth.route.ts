import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/register", AuthControllers.registerUser);

export const AuthRoutes = router;