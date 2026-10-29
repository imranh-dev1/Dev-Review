"use client";

import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useState } from "react";

import DataPagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	useGetNotifications,
	useMarkAllNotificationsRead,
	useMarkNotificationRead,
	useUnreadNotificationCount,
} from "@/hooks/notification.hook";
import type { NotificationType } from "@/types";

const typeLabels: Record<NotificationType, string> = {
	SUBMISSION_RECEIVED: "Submission",
	REVIEW_STARTED: "Review started",
	REVIEW_COMPLETED: "Review completed",
	CHANGES_REQUESTED: "Changes requested",
	SUBMISSION_APPROVED: "Approved",
	SUBMISSION_REJECTED: "Rejected",
	REVIEW_ASSIGNED: "Assigned",
	SYSTEM: "System",
};

function formatDate(value: string) {
	return new Date(value).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export default function NotificationList() {
	const [page, setPage] = useState(1);
	const [onlyUnread, setOnlyUnread] = useState(false);
	const limit = 10;

	const { data, isPending, isError } = useGetNotifications({
		page,
		limit,
		...(onlyUnread ? { isRead: false } : {}),
	});
	const { data: unreadData } = useUnreadNotificationCount();
	const markRead = useMarkNotificationRead();
	const markAll = useMarkAllNotificationsRead();

	const notifications = data?.data ?? [];
	const meta = data?.meta;
	const unreadCount = unreadData?.data?.count ?? 0;

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Bell className="size-4" />
					<span>
						{unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
					</span>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						variant={onlyUnread ? "default" : "outline"}
						size="sm"
						onClick={() => {
							setOnlyUnread((value) => !value);
							setPage(1);
						}}
					>
						{onlyUnread ? "Showing unread" : "Show unread only"}
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={unreadCount === 0 || markAll.isPending}
						onClick={() => markAll.mutate()}
					>
						<CheckCheck className="mr-1.5 size-4" />
						Mark all as read
					</Button>
				</div>
			</div>

			{isPending ? (
				<p className="border border-dashed p-10 text-center text-sm text-muted-foreground">
					Loading notifications...
				</p>
			) : isError ? (
				<p className="border border-dashed p-10 text-center text-sm text-destructive">
					Failed to load notifications.
				</p>
			) : notifications.length === 0 ? (
				<div className="flex flex-col items-center gap-3 border border-dashed p-12 text-center">
					<Inbox className="size-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						{onlyUnread ? "No unread notifications." : "No notifications yet."}
					</p>
				</div>
			) : (
				<Card className="gap-0 overflow-hidden py-0">
					<CardContent className="divide-y p-0">
						{notifications.map(
							(notification: {
								id: string;
								type: NotificationType;
								title: string;
								message: string;
								isRead: boolean;
								createdAt: string;
							}) => (
								<div
									key={notification.id}
									className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between ${
										notification.isRead ? "" : "bg-primary/5"
									}`}
								>
									<div className="min-w-0 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="outline">
												{typeLabels[notification.type] ?? notification.type}
											</Badge>
											{!notification.isRead ? (
												<span className="size-2 rounded-full bg-primary" />
											) : null}
										</div>
										<p className="font-medium">{notification.title}</p>
										<p className="text-sm text-muted-foreground">
											{notification.message}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatDate(notification.createdAt)}
										</p>
									</div>

									{!notification.isRead ? (
										<Button
											variant="ghost"
											size="sm"
											className="self-start"
											disabled={markRead.isPending}
											onClick={() => markRead.mutate(notification.id)}
										>
											Mark read
										</Button>
									) : null}
								</div>
							),
						)}
					</CardContent>
				</Card>
			)}

			{!isError ? (
				<DataPagination
					content="notifications"
					page={meta?.page ?? page}
					totalPages={meta?.totalPages ?? 0}
					total={meta?.total ?? 0}
					limit={meta?.limit ?? limit}
					isPending={isPending}
					onPageChange={setPage}
				/>
			) : null}
		</div>
	);
}
