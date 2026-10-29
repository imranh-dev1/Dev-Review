"use client";

import AssignmentsList from "@/components/dashboard/review/assignments-list";
import { PageHeader } from "@/components/shared/page-header";

export default function ReviewerAssignmentsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Review workspace"
				title="Assigned projects"
				description="Accept assignments, start reviews, and open submissions for detailed evaluation."
			/>

			<AssignmentsList
				viewerRole="REVIEWER"
				emptyMessage="You have no assignments yet."
			/>
		</div>
	);
}
