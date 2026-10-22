import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";
import { setAuthCookies } from "../../utils/setAuthCookies";

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



export const AuthControllers = {
	registerUser,
	verifyEmail,
	resendOtp
};
