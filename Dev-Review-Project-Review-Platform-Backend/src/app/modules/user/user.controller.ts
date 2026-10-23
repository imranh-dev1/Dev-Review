import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { UserServices } from "./user.service";

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

export const UserControllers = {
	updateProfile,
};
