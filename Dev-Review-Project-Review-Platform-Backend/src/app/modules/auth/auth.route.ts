// const router = Router();

// router.post(
// 	"/register",
// 	authLimiter,
// 	validate({ body: registerSchema }),
// 	AuthControllers.registerUser,
// );

// router.post(
// 	"/verify-email",
// 	authLimiter,
// 	validate({ body: verifyEmailSchema }),
// 	AuthControllers.verifyEmail,
// );

// router.post(
// 	"/resend-otp",
// 	authLimiter,
// 	validate({ body: resendOtpSchema }),
// 	AuthControllers.resendOtp,
// );

// router.post(
// 	"/login",
// 	authLimiter,
// 	validate({ body: loginSchema }),
// 	AuthControllers.loginUser,
// );

// router.post("/refresh", AuthControllers.refreshTokens);
// router.post("/logout", AuthControllers.logout);

// router.get("/me", authenticate, AuthControllers.getMe);

// router.patch(
// 	"/me",
// 	authenticate,
// 	validate({ body: updateProfileSchema }),
// 	AuthControllers.updateProfile,
// );

// router.patch(
// 	"/me/password",
// 	authenticate,
// 	validate({ body: changePasswordSchema }),
// 	AuthControllers.changePassword,
// );

// export const AuthRoutes = router;
