import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import { clearAuthCookies, setAuthCookies } from "../../utils/setAuthCookies";
import { AppError } from "../../utils/AppError";
import type { IRequestUser } from "./auth.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.registerUser(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: result.message,
		data: null,
	});
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.verifyEmail(req.body);

	setAuthCookies(res, result.accessToken, result.refreshToken);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Email verified successfully.",
		data: {
			user: result.user,
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		},
	});
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.resendOtp(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: result.message,
		data: null,
	});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.loginUser(req.body);

	setAuthCookies(res, result.accessToken, result.refreshToken);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Logged in successfully.",
		data: {
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
		},
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
	}
	const result = await AuthServices.refreshToken(req.cookies.refreshToken);

	const { accessToken, refreshToken: newRefreshToken } = result;

	setAuthCookies(res, accessToken, newRefreshToken);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken: newRefreshToken,
		},
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	if (!user) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"User information is missing in the request",
		);
	}

	const result = await AuthServices.getMe(user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile fetched successfully",
		data: result,
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	clearAuthCookies(res);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Logged out successfully.",
		data: null,
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthServices.forgotPassword(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: result.message,
		data: null,
	});
});

const forgotPasswordOtpVerify = catchAsync(
	async (req: Request, res: Response) => {
		const result = await AuthServices.forgotPasswordOtpVerify(req.body);

		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: result.message,
			data: null,
		});
	},
);

export const AuthControllers = {
	registerUser,
	verifyEmail,
	resendOtp,
	loginUser,
	refreshToken,
	getMe,
	logout,
	forgotPassword,
	forgotPasswordOtpVerify,
};
