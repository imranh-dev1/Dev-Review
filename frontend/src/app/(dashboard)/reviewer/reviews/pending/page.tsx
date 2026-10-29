"use client";

import AssignmentsList from "@/components/dashboard/review/assignments-list";
import { PageHeader } from "@/components/shared/page-header";

export default function ReviewerPendingReviewsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Review workspace"
				title="Pending reviews"
				description="Projects that are assigned to you and still need a completed review."
			/>

			<AssignmentsList
				viewerRole="REVIEWER"
				statuses={["ASSIGNED", "ACCEPTED"]}
				emptyMessage="You are all caught up. No pending reviews."
			/>
		</div>
	);
}
