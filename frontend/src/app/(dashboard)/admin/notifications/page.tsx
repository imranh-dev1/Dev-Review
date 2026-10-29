"use client";

import NotificationList from "@/components/notifications/notification-list";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminNotificationsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="System"
				title="Notifications"
				description="Platform alerts, review activity, and account updates."
			/>

			<NotificationList />
		</div>
	);
}
