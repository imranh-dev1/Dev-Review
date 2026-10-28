import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import type { RequestUser } from "../../middleware/checkAuth";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params?.id as string;

	const result = await ReviewServices.createReview(id, user, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Review submitted successfully.",
		data: result,
	});
});

export const ReviewControllers = {
	createReview,
};
