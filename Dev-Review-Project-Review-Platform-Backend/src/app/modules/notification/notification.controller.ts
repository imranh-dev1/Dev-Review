import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/checkAuth";
import { NotificationServices } from "../../services/notification.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const listNotifications = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const { data, meta } = await NotificationServices.listNotifications(
		user.userId,
		req.query,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Notifications fetched successfully.",
		data,
		meta,
	});
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const result = await NotificationServices.getUnreadCount(user.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Unread notification count fetched successfully.",
		data: result,
	});
});

const markNotificationRead = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id as string;

	const result = await NotificationServices.markNotificationRead(
		id,
		user.userId,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Notification marked as read.",
		data: result,
	});
});

const markAllNotificationsRead = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as RequestUser;
		const result = await NotificationServices.markAllNotificationsRead(
			user.userId,
		);

		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "All notifications marked as read.",
			data: result,
		});
	},
);

export const NotificationControllers = {
	listNotifications,
	getUnreadCount,
	markNotificationRead,
	markAllNotificationsRead,
};
