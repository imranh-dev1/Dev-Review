import httpStatus from "http-status";
import { Temporal } from "temporal-polyfill";
import { db } from "../../../prisma/db";
import { AppError } from "../../utils/AppError";
import { buildMeta, getPagination } from "../../utils/pagination";

interface NotificationListQuery {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

const listNotifications = async (recipientId: string, query: NotificationListQuery) => {
    const { page, limit, skip, take } = getPagination(query);

    const filter = {
        recipientId,
        ...(query.unreadOnly ? { isRead: false } : {}),
    };

    const countResult = await db.orm.public.Notification
        .where(filter)
        .aggregate((a) => ({ count: a.count() }));

    const rows = await db.orm.public.Notification
        .where(filter)
        .orderBy((n) => n.createdAt.desc())
        .limit(take)
        .offset(skip)
        .all();

    return { rows, meta: buildMeta(page, limit, countResult.count) };
};

const unreadCount = async (recipientId: string) => {
    const result = await db.orm.public.Notification
        .where({ recipientId, isRead: false })
        .aggregate((a) => ({ count: a.count() }));

    return { unread: result.count };
};

const markRead = async (recipientId: string, id: string) => {
    const notification = await db.orm.public.Notification.first({ id, recipientId });

    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
    }

    if (!notification.isRead) {
        await db.orm.public.Notification.where({ id }).update({
            isRead: true,
            readAt: Temporal.Now.instant(),
        });
    }

    return { id, isRead: true };
};

const markAllRead = async (recipientId: string) => {
    await db.orm.public.Notification
        .where({ recipientId, isRead: false })
        .update({
            isRead: true,
            readAt: Temporal.Now.instant(),
        });

    return { message: "All notifications marked as read." };
};

export const NotificationServices = {
    listNotifications,
    unreadCount,
    markRead,
    markAllRead,
};
