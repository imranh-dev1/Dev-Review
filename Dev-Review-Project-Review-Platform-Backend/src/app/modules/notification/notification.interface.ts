import type { NotificationType } from "../../types/models";

export interface INotificationListQuery {
	page?: number;
	limit?: number;
	type?: NotificationType;
	isRead?: boolean;
}
