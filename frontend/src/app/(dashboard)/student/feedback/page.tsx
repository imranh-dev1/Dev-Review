"use client";

import ReviewsList from "@/components/dashboard/review/reviews-list";
import { PageHeader } from "@/components/shared/page-header";

export default function StudentFeedbackPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="My projects"
				title="Review feedback"
				description="Feedback and scores from reviewers across all of your submissions."
			/>

			<ReviewsList
				submissionHrefBase="/student/submissions"
				emptyMessage="No feedback yet. Submit a project to get it reviewed."
			/>
		</div>
	);
}
