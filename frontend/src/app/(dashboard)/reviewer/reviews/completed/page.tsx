"use client";

import AssignmentsList from "@/components/dashboard/review/assignments-list";
import { PageHeader } from "@/components/shared/page-header";

export default function ReviewerCompletedReviewsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Review workspace"
				title="Completed reviews"
				description="Assignments where you have already submitted your evaluation."
			/>

			<AssignmentsList
				viewerRole="REVIEWER"
				statuses={["COMPLETED"]}
				emptyMessage="No completed reviews yet."
			/>
		</div>
	);
}
