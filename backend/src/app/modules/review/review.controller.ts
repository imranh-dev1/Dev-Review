import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

const currentUser = (req: Request) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return req.user;
};

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await ReviewServices.createReview(getParam(req, "id"), user, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review submitted successfully.",
        data: result,
    });
});

const listReviews = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const reviews = await ReviewServices.listReviews(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully.",
        data: reviews,
    });
});

const assignReviewer = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await ReviewServices.assignReviewer(getParam(req, "id"), user, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Reviewer assigned successfully.",
        data: result,
    });
});

const acceptAssignment = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await ReviewServices.acceptAssignment(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Assignment accepted successfully.",
        data: result,
    });
});

const cancelAssignment = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await ReviewServices.cancelAssignment(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Assignment cancelled successfully.",
        data: result,
    });
});

const listMyAssignments = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const { rows, meta } = await ReviewServices.listMyAssignments(user, req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Assignments fetched successfully.",
        data: rows,
        meta,
    });
});

export const ReviewControllers = {
    createReview,
    listReviews,
    assignReviewer,
    acceptAssignment,
    cancelAssignment,
    listMyAssignments,
};
