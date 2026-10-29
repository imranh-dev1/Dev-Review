import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/checkAuth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
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

const listReviews = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const { data, meta } = await ReviewServices.listReviews(user, req.query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Reviews fetched successfully.",
		data,
		meta,
	});
});

const listAssignments = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const { data, meta } = await ReviewServices.listAssignments(user, req.query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review assignments fetched successfully.",
		data,
		meta,
	});
});

const assignReviewer = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id as string;

	const result = await ReviewServices.assignReviewer(id, user, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Reviewer assigned successfully.",
		data: result,
	});
});

const startReview = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id as string;

	const result = await ReviewServices.startReview(id, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review started successfully.",
		data: result,
	});
});

const acceptAssignment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id as string;

	const result = await ReviewServices.acceptAssignment(id, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Assignment accepted successfully.",
		data: result,
	});
});

const cancelAssignment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id as string;

	const result = await ReviewServices.cancelAssignment(id, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Assignment cancelled successfully.",
		data: result,
	});
});

const getReviewCriteria = catchAsync(async (_req: Request, res: Response) => {
	const result = await ReviewServices.getReviewCriteria();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review criteria fetched successfully.",
		data: result,
	});
});

const listAllCriteria = catchAsync(async (_req: Request, res: Response) => {
	const result = await ReviewServices.listAllCriteria();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review criteria fetched successfully.",
		data: result,
	});
});

const createCriterion = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const result = await ReviewServices.createCriterion(user, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Review criterion created successfully.",
		data: result,
	});
});

const updateCriterion = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id as string;

	const result = await ReviewServices.updateCriterion(id, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review criterion updated successfully.",
		data: result,
	});
});

const deleteCriterion = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id as string;

	const result = await ReviewServices.deleteCriterion(id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review criterion deleted successfully.",
		data: result,
	});
});

export const ReviewControllers = {
	createReview,
	listReviews,
	listAssignments,
	assignReviewer,
	startReview,
	acceptAssignment,
	cancelAssignment,
	getReviewCriteria,
	listAllCriteria,
	createCriterion,
	updateCriterion,
	deleteCriterion,
};
