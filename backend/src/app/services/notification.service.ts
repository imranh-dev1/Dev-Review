import { db } from "../../prisma/db";
import { asVarchar } from "../utils/casts";
import type { NotificationType } from "../types/models";

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
    title: asVarchar<150>(entry.title),
    message: entry.message,
    submissionId: entry.submissionId ?? null,
});

export const createNotification = async (entry: NotificationEntry) => {
    return db.orm.public.Notification.create(buildData(entry));
};

export const createNotificationInTx = async (tx: Tx, entry: NotificationEntry) => {
    return tx.orm.public.Notification.create(buildData(entry));
};
