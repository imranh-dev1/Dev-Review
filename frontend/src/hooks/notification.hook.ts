import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getNotifications,
	getUnreadNotificationCount,
	type INotificationListQuery,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/api/notification.api";

export const useGetNotifications = (query?: INotificationListQuery) => {
	return useQuery({
		queryKey: ["notifications", query],
		queryFn: () => getNotifications(query),
	});
};

export const useUnreadNotificationCount = () => {
	return useQuery({
		queryKey: ["notifications", "unread-count"],
		queryFn: getUnreadNotificationCount,
		refetchInterval: 60_000,
	});
};

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => markNotificationRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

export const useMarkAllNotificationsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};
