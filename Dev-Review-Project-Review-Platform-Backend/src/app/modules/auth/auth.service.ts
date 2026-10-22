import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { db } from "../../../prisma/db";
import config from "../../config";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import sendEmail from "../../utils/sendEmail";
import type {
	ILoginPayload,
	IRequestUser,
	IResendOtpPayload,
	IUserRegisterPayload,
	IVerifyEmailPayload,
} from "./auth.interface";
import { UserRole, UserStatus } from "../../types/models";
import { jwtUtils } from "../../utils/jwt";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

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
		throw new AppError(
			httpStatus.CONFLICT,
			"User with this email already exists",
		);
	}

	const saltRounds = Number(config.bcrypt_salt_rounds);
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const otpKey = `registration-otp:${email}`;
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	const expirationSeconds = 5 * 60;
	const registerDataExpirationSeconds = 10 * 60;

	await redisClient.set(otpKey, otpValue, {
		expiration: { type: "EX", value: expirationSeconds },
	});

	const registrationKey = `registration-data:${email}`;
	const redisUserDataPayload = {
		name,
		email,
		password: hashedPassword,
		role: UserRole.STUDENT,
	};

	await redisClient.set(registrationKey, JSON.stringify(redisUserDataPayload), {
		expiration: { type: "EX", value: registerDataExpirationSeconds },
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

const verifyEmail = async (payload: IVerifyEmailPayload) => {
	const email = payload.email.trim().toLowerCase();

	const otpKey = `registration-otp:${email}`;
	const registrationKey = `registration-data:${email}`;

	const storedOtp = await redisClient.get(otpKey);
	const storedRegisterPayload = await redisClient.get(registrationKey);

	if (!storedOtp || !storedRegisterPayload) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Verification code expired or invalid. Please register again.",
		);
	}

	const otpMatches = storedOtp === payload.otp;

	if (!otpMatches) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid verification code");
	}

	if (!storedRegisterPayload) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Registration data has expired. Please register again.",
		);
	}

	const redisUserDataPayload = JSON.parse(storedRegisterPayload);

	const createdUser = await db.orm.public.User.create({
		name: redisUserDataPayload.name,
		email: redisUserDataPayload.email,
		passwordHash: redisUserDataPayload.password,
		role: UserRole.STUDENT,
		status: UserStatus.ACTIVE,
	});

	await redisClient.del([otpKey, registrationKey]);

	await sendEmail({
		to: redisUserDataPayload.email,
		subject: "Welcome to Dev Review System!",
		template: "welcome",
		data: {
			name: redisUserDataPayload.name,
			email: redisUserDataPayload.email,
		},
	});

	const { passwordHash, ...user } = createdUser;

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user: user,
		accessToken,
		refreshToken,
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

	const expirationSeconds = 5 * 60;

	await redisClient.set(otpKey, otpValue, {
		expiration: { type: "EX", value: expirationSeconds },
	});
	await redisClient.expire(registrationKey, expirationSeconds);

	await sendEmail({
		to: email,
		subject: "Your New DevReview Verification Code",
		template: "email-verification",
		data: {
			name,
			otp: otpValue,
			expirationMinutes: Math.ceil(expirationSeconds / 60),
		},
	});

	return {
		success: true,
		message: "Verification OTP resent to email successfully.",
	};
};

const loginUser = async (payload: ILoginPayload) => {
	const email = payload.email.trim().toLowerCase();

	const user = await db.orm.public.User.where({
		email: email,
	}).first();

	if (!user || !user.passwordHash) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	const passwordMatches = await bcrypt.compare(
		payload.password,
		user.passwordHash,
	);

	if (!passwordMatches) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	if (!user.emailVerifiedAt) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Please verify your email before logging in",
		);
	}

	if (user.status !== UserStatus.ACTIVE) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Account is not active. Contact administrator.",
		);
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await db.orm.public.User.where({
		id: data.userId,
	}).first();

	if (!user || user.status !== UserStatus.ACTIVE) {
		throw new AppError(401, "User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const getMe = async (user: IRequestUser) => {
	const isUserExists = await db.orm.public.User.first({
		id: user.userId,
	});

	if (!isUserExists) {
		throw new AppError(httpStatus.FORBIDDEN, "User not found...");
	}

	const { passwordHash, ...currentUser } = isUserExists;

	return currentUser;
};

export const AuthServices = {
	registerUser,
	verifyEmail,
	resendOtp,
	loginUser,
	refreshToken,
	getMe,
};
