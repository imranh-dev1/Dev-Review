import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { SubmissionServices } from "./submission.service";

const currentUser = (req: Request) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return req.user;
};

const createSubmission = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const submission = await SubmissionServices.createSubmission(user.id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Submission created successfully.",
        data: submission,
    });
});

const listMySubmissions = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const { rows, meta } = await SubmissionServices.listMySubmissions(user.id, req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submissions fetched successfully.",
        data: rows,
        meta,
    });
});

const listAllSubmissions = catchAsync(async (req: Request, res: Response) => {
    const { rows, meta } = await SubmissionServices.listAllSubmissions(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submissions fetched successfully.",
        data: rows,
        meta,
    });
});

const listReviewerQueue = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const { rows, meta } = await SubmissionServices.listReviewerQueue(user.id, req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review queue fetched successfully.",
        data: rows,
        meta,
    });
});

const getSubmissionDetail = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const submission = await SubmissionServices.getSubmissionDetail(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submission fetched successfully.",
        data: submission,
    });
});

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const submission = await SubmissionServices.updateSubmission(
        getParam(req, "id"),
        user,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submission updated successfully.",
        data: submission,
    });
});

const softDeleteSubmission = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await SubmissionServices.softDeleteSubmission(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submission deleted successfully.",
        data: result,
    });
});

const submitSubmission = catchAsync(async (req: Request, res: Response) => {
    const user = currentUser(req);
    const result = await SubmissionServices.submitSubmission(getParam(req, "id"), user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Submission submitted successfully.",
        data: result,
    });
});

export const SubmissionControllers = {
    createSubmission,
    listMySubmissions,
    listAllSubmissions,
    listReviewerQueue,
    getSubmissionDetail,
    updateSubmission,
    softDeleteSubmission,
    submitSubmission,
};
