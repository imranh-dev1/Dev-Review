import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getPlatformStats = catchAsync(async (_req: Request, res: Response) => {
    const stats = await AnalyticsServices.getPlatformStats();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Platform stats fetched successfully.",
        data: stats,
    });
});

const getMyStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await AnalyticsServices.getMyStats(
        AnalyticsServices.assertUser(req.user?.id),
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your stats fetched successfully.",
        data: stats,
    });
});

const getReviewerStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await AnalyticsServices.getReviewerStats(
        AnalyticsServices.assertUser(req.user?.id),
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviewer stats fetched successfully.",
        data: stats,
    });
});

export const AnalyticsControllers = {
    getPlatformStats,
    getMyStats,
    getReviewerStats,
};
