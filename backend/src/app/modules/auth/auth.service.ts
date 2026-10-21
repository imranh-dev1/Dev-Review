import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import config from "../../config";
import { redisClient } from "../../lib/redis";
import { recordAudit } from "../../services/audit.service";
import { AppError } from "../../utils/AppError";
import { asVarchar } from "../../utils/casts";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../utils/jwt";
import sendEmail from "../../utils/sendEmail";
import type { UserRole } from "../../types/models";
import type {
    IChangePasswordPayload,
    ILoginPayload,
    IPublicUser,
    IResendOtpPayload,
    IUserRegisterPayload,
    IUpdateProfilePayload,
    IVerifyEmailPayload,
} from "./auth.interface";

const OTP_TTL_SECONDS = 10 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

const refreshKey = (jti: string) => `refresh-token:${jti}`;
const userRefreshSetKey = (userId: string) => `refresh-tokens:${userId}`;

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

interface IssueTokensUser {
    id: string;
    email: string;
    role: UserRole;
}

const issueTokens = async (user: IssueTokensUser): Promise<TokenPair> => {
    const jti = crypto.randomUUID();

    const accessToken = signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = signRefreshToken({
        sub: user.id,
        role: user.role,
        jti,
    });

    await redisClient.set(refreshKey(jti), user.id, {
        expiration: { type: "EX", value: REFRESH_TTL_SECONDS },
    });
    await redisClient.sAdd(userRefreshSetKey(user.id), jti);

    return { accessToken, refreshToken };
};

const toPublicUser = (user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: string;
    status: string;
    emailVerifiedAt?: unknown;
    createdAt: unknown;
    updatedAt: unknown;
}): IPublicUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    role: user.role as UserRole,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const registerUser = async (payload: IUserRegisterPayload) => {
    const { name, email: rawEmail, password } = payload;
    const email = rawEmail.trim().toLowerCase();

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    const isUserExists = await db.orm.public.User.first({
        email: asVarchar<255>(email),
    });

    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    const saltRounds = Number(config.bcrypt_salt_rounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const otpKey = `registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    await redisClient.set(otpKey, otpValue, {
        expiration: { type: "EX", value: OTP_TTL_SECONDS },
    });

    const registrationKey = `registration-data:${email}`;
    const redisUserDataPayload = {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT" as const,
    };

    await redisClient.set(registrationKey, JSON.stringify(redisUserDataPayload), {
        expiration: { type: "EX", value: OTP_TTL_SECONDS },
    });

    await sendEmail({
        to: email,
        subject: "Verify Your DevReview Email Address",
        template: "email-verification",
        data: {
            name,
            otp: otpValue,
            expirationMinutes: Math.ceil(OTP_TTL_SECONDS / 60),
        },
    });

    return {
        success: true,
        message: "Verification OTP sent to email successfully.",
    };
};

const verifyEmail = async (payload: IVerifyEmailPayload) => {
    const email = payload.email.trim().toLowerCase();

    const otpKey = `registration-otp:${email}`;
    const registrationKey = `registration-data:${email}`;

    const [storedOtp, rawData] = await Promise.all([
        redisClient.get(otpKey),
        redisClient.get(registrationKey),
    ]);

    if (!storedOtp || !rawData) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Verification code expired or invalid. Please register again.",
        );
    }

    const otpMatches =
        storedOtp.length === payload.otp.length &&
        crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(payload.otp));

    if (!otpMatches) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid verification code");
    }

    const data = JSON.parse(rawData) as {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    };

    const user = await db.orm.public.User.create({
        name: asVarchar<100>(data.name),
        email: asVarchar<255>(data.email),
        passwordHash: data.password,
        role: data.role,
        emailVerifiedAt: Temporal.Now.instant(),
    });

    await redisClient.del([otpKey, registrationKey]);

    await recordAudit({
        actorId: user.id,
        action: "CREATE",
        entityType: "USER",
        entityId: user.id,
        metadata: { method: "email-verification" },
    });

    const tokens = await issueTokens(user);

    return {
        user: toPublicUser(user),
        ...tokens,
    };
};

const resendOtp = async (payload: IResendOtpPayload) => {
    const email = payload.email.trim().toLowerCase();

    const registrationKey = `registration-data:${email}`;
    const rawData = await redisClient.get(registrationKey);

    if (!rawData) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "No pending registration found for this email",
        );
    }

    const { name } = JSON.parse(rawData) as { name: string };

    const otpKey = `registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    await redisClient.set(otpKey, otpValue, {
        expiration: { type: "EX", value: OTP_TTL_SECONDS },
    });
    await redisClient.expire(registrationKey, OTP_TTL_SECONDS);

    await sendEmail({
        to: email,
        subject: "Your New DevReview Verification Code",
        template: "email-verification",
        data: {
            name,
            otp: otpValue,
            expirationMinutes: Math.ceil(OTP_TTL_SECONDS / 60),
        },
    });

    return {
        success: true,
        message: "Verification OTP resent to email successfully.",
    };
};

const loginUser = async (payload: ILoginPayload) => {
    const email = payload.email.trim().toLowerCase();

    const user = await db.orm.public.User
        .where((u) => u.email.eq(asVarchar<255>(email)))
        .first();

    if (!user || !user.passwordHash) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatches) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    if (!user.emailVerifiedAt) {
        throw new AppError(httpStatus.FORBIDDEN, "Please verify your email before logging in");
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(httpStatus.FORBIDDEN, "Account is not active. Contact administrator.");
    }

    const tokens = await issueTokens(user);

    await recordAudit({
        actorId: user.id,
        action: "LOGIN",
        entityType: "USER",
        entityId: user.id,
        metadata: { email: user.email },
    });

    return {
        user: toPublicUser(user),
        ...tokens,
    };
};

const refreshTokens = async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);

    const storedUserId = await redisClient.get(refreshKey(payload.jti));
    if (!storedUserId || storedUserId !== payload.sub) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await db.orm.public.User
        .where({ id: payload.sub })
        .select(
            "id",
            "name",
            "email",
            "avatar",
            "role",
            "status",
            "emailVerifiedAt",
            "createdAt",
            "updatedAt",
        )
        .first();

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Account no longer exists");
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(httpStatus.FORBIDDEN, "Account is not active. Contact administrator.");
    }

    await redisClient.del(refreshKey(payload.jti));
    await redisClient.sRem(userRefreshSetKey(user.id), payload.jti);

    const tokens = await issueTokens(user);

    return {
        user: toPublicUser(user),
        ...tokens,
    };
};

const logout = async (refreshToken?: string) => {
    if (refreshToken) {
        try {
            const payload = verifyRefreshToken(refreshToken);
            await redisClient.del(refreshKey(payload.jti));
            await redisClient.sRem(userRefreshSetKey(payload.sub), payload.jti);
        } catch {
            // Token invalid/expired — nothing to revoke.
        }
    }

    return {
        success: true,
        message: "Logged out successfully.",
    };
};

const getMe = async (userId: string) => {
    const user = await db.orm.public.User
        .where({ id: userId })
        .select(
            "id",
            "name",
            "email",
            "avatar",
            "role",
            "status",
            "emailVerifiedAt",
            "createdAt",
            "updatedAt",
        )
        .first();

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return toPublicUser(user);
};

const updateProfile = async (userId: string, payload: IUpdateProfilePayload) => {
    const update: Record<string, unknown> = {};
    if (payload.name !== undefined) update.name = asVarchar<100>(payload.name);
    if (payload.avatar !== undefined) update.avatar = payload.avatar;

    await db.orm.public.User.where({ id: userId }).update(update as never);

    await recordAudit({
        actorId: userId,
        action: "UPDATE",
        entityType: "USER",
        entityId: userId,
        metadata: { fields: Object.keys(update) },
    });

    return getMe(userId);
};

const changePassword = async (userId: string, payload: IChangePasswordPayload) => {
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user || !user.passwordHash) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const currentMatches = await bcrypt.compare(payload.currentPassword, user.passwordHash);
    if (!currentMatches) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
    }

    const saltRounds = Number(config.bcrypt_salt_rounds);
    const hashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

    await db.orm.public.User.where({ id: userId }).update({
        passwordHash: hashedPassword,
    });

    const setKey = userRefreshSetKey(userId);
    const jtiList = await redisClient.sMembers(setKey);
    if (jtiList.length > 0) {
        await redisClient.del(jtiList.map((jti) => refreshKey(jti)));
        await redisClient.del(setKey);
    }

    await recordAudit({
        actorId: userId,
        action: "UPDATE",
        entityType: "USER",
        entityId: userId,
        metadata: { fields: ["password"] },
    });

    return {
        success: true,
        message: "Password updated successfully. All sessions have been logged out.",
    };
};

export const AuthServices = {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    refreshTokens,
    logout,
    getMe,
    updateProfile,
    changePassword,
};
