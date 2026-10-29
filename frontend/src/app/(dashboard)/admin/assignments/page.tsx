"use client";

import AssignReviewerForm from "@/components/dashboard/review/assign-reviewer-form";
import AssignmentsList from "@/components/dashboard/review/assignments-list";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminAssignmentsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title="Review assignments"
				description="Assign reviewers to submissions and monitor progress."
			/>

			<AssignReviewerForm />

			<AssignmentsList
				viewerRole="ADMIN"
				emptyMessage="No review assignments have been created yet."
			/>
		</div>
	);
}
