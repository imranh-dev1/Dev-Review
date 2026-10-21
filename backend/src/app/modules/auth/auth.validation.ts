import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(72),
});

export const verifyEmailSchema = z.object({
    email: z.string().trim().email().max(255),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const resendOtpSchema = z.object({
    email: z.string().trim().email().max(255),
});

export const loginSchema = z.object({
    email: z.string().trim().email().max(255),
    password: z.string().min(1).max(72),
});

export const updateProfileSchema = z
    .object({
        name: z.string().trim().min(2).max(100).optional(),
        avatar: z.url().max(2048).optional(),
    })
    .refine((data) => data.name !== undefined || data.avatar !== undefined, {
        message: "At least one field (name or avatar) is required",
    });

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1).max(72),
    newPassword: z.string().min(8).max(72),
});
