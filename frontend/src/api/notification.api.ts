import apiClint from "@/lib/apiClint";
import type { NotificationType } from "@/types";

export interface INotificationListQuery {
	page?: number;
	limit?: number;
	isRead?: boolean;
	type?: NotificationType;
}

export const getNotifications = (query?: INotificationListQuery) => {
	return apiClint("/notifications", {
		method: "GET",
		query,
	});
};

export const getUnreadNotificationCount = () => {
	return apiClint("/notifications/unread-count", {
		method: "GET",
	});
};

export const markNotificationRead = (id: string) => {
	return apiClint(`/notifications/${id}/read`, {
		method: "PATCH",
	});
};

export const markAllNotificationsRead = () => {
	return apiClint("/notifications/read-all", {
		method: "PATCH",
	});
};
