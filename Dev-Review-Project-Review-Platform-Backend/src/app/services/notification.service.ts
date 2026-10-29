import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../prisma/db";
import type { INotificationListQuery } from "../modules/notification/notification.interface";
import type { NotificationType } from "../types/models";
import { AppError } from "../utils/AppError";
import { buildMeta, getPagination } from "../utils/pagination";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface NotificationEntry {
	recipientId: string;
	type: NotificationType;
	title: string;
	message: string;
	submissionId?: string | null;
}

const buildData = (entry: NotificationEntry) => ({
	recipientId: entry.recipientId,
	type: entry.type,
	title: entry.title,
	message: entry.message,
	submissionId: entry.submissionId ?? null,
});

export const createNotification = async (entry: NotificationEntry) => {
	return db.orm.public.Notification.create(buildData(entry));
};

export const createNotificationInTx = async (
	tx: Tx,
	entry: NotificationEntry,
) => {
	return tx.orm.public.Notification.create(buildData(entry));
};

const listNotifications = async (
	recipientId: string,
	query: INotificationListQuery,
) => {
	const { page, limit, skip, take } = getPagination(query);

	const isRead = query.isRead === true || (query.isRead as unknown) === "true";

	const notifications = db.orm.public.Notification.where({
		recipientId,
		...(query.type ? { type: query.type } : {}),
		...(query.isRead !== undefined ? { isRead } : {}),
	});

	const { count } = await notifications.aggregate((a) => ({
		count: a.count(),
	}));

	const data = await notifications
		.orderBy([
			(notification) => notification.createdAt.desc(),
			(notification) => notification.id.desc(),
		])
		.limit(take)
		.offset(skip)
		.include("submission", (submission) =>
			submission.select("id", "title", "status"),
		)
		.all();

	return {
		data,
		meta: buildMeta(page, limit, count),
	};
};

const getUnreadCount = async (recipientId: string) => {
	const { count } = await db.orm.public.Notification.where({
		recipientId,
		isRead: false,
	}).aggregate((a) => ({ count: a.count() }));

	return { count };
};

const markNotificationRead = async (id: string, recipientId: string) => {
	const notification = await db.orm.public.Notification.where({
		id,
		recipientId,
	}).first();

	if (!notification) {
		throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
	}

	if (notification.isRead) {
		return notification;
	}

	const updated = await db.orm.public.Notification.where({ id }).update({
		isRead: true,
		readAt: Temporal.Now.instant(),
	} as never);

	return updated;
};

const markAllNotificationsRead = async (recipientId: string) => {
	const unread = await db.orm.public.Notification.where({
		recipientId,
		isRead: false,
	})
		.select("id")
		.all();

	if (unread.length === 0) {
		return { updated: 0 };
	}

	const readAt = Temporal.Now.instant();

	await Promise.all(
		unread.map((notification) =>
			db.orm.public.Notification.where({ id: notification.id }).update({
				isRead: true,
				readAt,
			} as never),
		),
	);

	return { updated: unread.length };
};

export const NotificationServices = {
	createNotification,
	createNotificationInTx,
	listNotifications,
	getUnreadCount,
	markNotificationRead,
	markAllNotificationsRead,
};
