"use client";

import NotificationList from "@/components/notifications/notification-list";
import { PageHeader } from "@/components/shared/page-header";

export default function StudentNotificationsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Account"
				title="Notifications"
				description="Updates about your submissions, reviews, and account."
			/>

			<NotificationList />
		</div>
	);
}
