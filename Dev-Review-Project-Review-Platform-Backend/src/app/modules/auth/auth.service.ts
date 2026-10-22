import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { db } from "../../../prisma/db";
import config from "../../config";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import sendEmail from "../../utils/sendEmail";
import type { IUserRegisterPayload } from "./auth.interface";

const registerUser = async (payload: IUserRegisterPayload) => {
    const { name, email: rawEmail, password } = payload;
    const email = rawEmail.trim().toLowerCase();

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
    }

    const isUserExists = await db.orm.public.User.first({
        email: email,
    });

    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const saltRounds = Number(config.bcrypt_salt_rounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const otpKey = `registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    const expirationSeconds = 5 * 60;

    await redisClient.set(otpKey, otpValue, {
        expiration: { type: "EX", value: expirationSeconds },
    });

    const registrationKey = `registration-data:${email}`;
    const redisUserDataPayload = {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT" as const,
    };

    await redisClient.set(registrationKey, JSON.stringify(redisUserDataPayload), {
        expiration: { type: "EX", value: expirationSeconds },
    });

    await sendEmail({
        to: email,
        subject: "Verify Your DevReview Email Address",
        template: "email-verification",
        data: {
            name,
            otp: otpValue,
            expirationMinutes: Math.ceil(expirationSeconds / 60),
        },
    });

    return {
        success: true,
        message: "Verification OTP sent to email successfully.",
    };
};

export const AuthServices = {
    registerUser,
};