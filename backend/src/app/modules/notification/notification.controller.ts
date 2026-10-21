import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { NotificationServices } from "./notification.service";

const currentUserId = (req: Request): string => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return req.user.id;
};

const listNotifications = catchAsync(async (req: Request, res: Response) => {
    const { rows, meta } = await NotificationServices.listNotifications(
        currentUserId(req),
        req.query,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Notifications fetched successfully.",
        data: rows,
        meta,
    });
});

const unreadCount = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationServices.unreadCount(currentUserId(req));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Unread count fetched successfully.",
        data: result,
    });
});

const markRead = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationServices.markRead(currentUserId(req), getParam(req, "id"));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Notification marked as read.",
        data: result,
    });
});

const markAllRead = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationServices.markAllRead(currentUserId(req));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: null,
    });
});

export const NotificationControllers = {
    listNotifications,
    unreadCount,
    markRead,
    markAllRead,
};
