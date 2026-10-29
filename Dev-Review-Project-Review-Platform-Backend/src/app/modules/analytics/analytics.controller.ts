import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/checkAuth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getStudentAnalytics = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const result = await AnalyticsServices.getStudentAnalytics(user.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Student analytics fetched successfully.",
		data: result,
	});
});

const getReviewerAnalytics = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const result = await AnalyticsServices.getReviewerAnalytics(user.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Reviewer analytics fetched successfully.",
		data: result,
	});
});

const getAdminAnalytics = catchAsync(async (_req: Request, res: Response) => {
	const result = await AnalyticsServices.getAdminAnalytics();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Platform analytics fetched successfully.",
		data: result,
	});
});

export const AnalyticsControllers = {
	getStudentAnalytics,
	getReviewerAnalytics,
	getAdminAnalytics,
};
