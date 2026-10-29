"use client";

import NotificationList from "@/components/notifications/notification-list";
import { PageHeader } from "@/components/shared/page-header";

export default function ReviewerNotificationsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Account"
				title="Notifications"
				description="Assignments, review updates, and platform announcements."
			/>

			<NotificationList />
		</div>
	);
}
