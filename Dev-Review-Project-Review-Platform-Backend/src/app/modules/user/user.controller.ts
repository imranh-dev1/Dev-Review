import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { UserServices } from "./user.service";
import type { RequestUser } from "../../middleware/checkAuth";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	if (!req.user?.userId) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Please log in to update your profile.",
		);
	}

	const result = await UserServices.updateProfile(
		req.user.userId,
		req.body,
		req.file?.buffer,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Profile updated successfully.",
		data: result,
	});
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
	const user: RequestUser = req.user!;

	const result = await UserServices.changePassword(user, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: result.message,
		data: null,
	});
});

const listUsers = catchAsync(async (req: Request, res: Response) => {
	const { data, meta } = await UserServices.listUsers(req.query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users fetched successfully.",
		data: data,
		meta,
	});
});

const getUserDetail = catchAsync(async (req: Request, res: Response) => {  

	const user = await UserServices.getUserDetail(req?.params?.id as string);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User fetched successfully.",
		data: user,
	});
});

export const UserControllers = {
	updateProfile,
	changePassword,
	listUsers,
	getUserDetail,
};
