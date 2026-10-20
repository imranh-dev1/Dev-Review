import { db } from "../../../prisma/db";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import type { IUserRegisterPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcrypt"
import crypto from "crypto"
import { redisClient } from "../../lib/redis";
import sendEmail from "../../utils/sendEmail";

const registerUser = async (payload: IUserRegisterPayload) => {
    const { name, email: rawEmail, password } = payload;
    const email = rawEmail.trim().toLowerCase();

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    const isUserExists = await db.orm.public.User.first({
        email: email as never,
    });

    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const saltRounds = Number(config.bcrypt_salt_rounds);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const expirationSeconds = 10 * 60;
    const otpKey = `registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    await redisClient.set(otpKey, otpValue, {
        expiration: {
            type: "EX",
            value: expirationSeconds,
        },
    });

    const registrationKey = `registration-data:${email}`;
    const redisUserDataPayload = {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT" as const,
    };

    await redisClient.set(
        registrationKey,
        JSON.stringify(redisUserDataPayload),
        {
            expiration: {
                type: "EX",
                value: expirationSeconds,
            },
        },
    );

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
    registerUser
}