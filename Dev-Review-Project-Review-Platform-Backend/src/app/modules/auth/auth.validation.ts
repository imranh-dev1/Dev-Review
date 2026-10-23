import { z } from "zod";

const registerSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z.string().trim().email().max(255),
	password: z.string().min(8).max(72),
});

const verifyEmailSchema = z.object({
	email: z.string().trim().email().max(255),
	otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

const resendOtpSchema = z.object({
	email: z.string().trim().email().max(255),
});

const loginSchema = z.object({
	email: z.string().trim().email().max(255),
	password: z.string().min(1).max(72),
});

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1).max(72),
	newPassword: z.string().min(8).max(72),
});

const forgotPasswordSchema = z.object({
	email: z.string().trim().email().min(1),
});

const forgotPasswordOtpVerifySchema = z.object({
	email: z.string().trim().email(),
	otp: z.string().length(6, "OTP must be 6 digits"),
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(72, "Password must not exceed 72 characters"),
});

export const userValidation = {
	registerSchema,
	verifyEmailSchema,
	resendOtpSchema,
	loginSchema,
	changePasswordSchema,
	forgotPasswordSchema,
	forgotPasswordOtpVerifySchema,
};
