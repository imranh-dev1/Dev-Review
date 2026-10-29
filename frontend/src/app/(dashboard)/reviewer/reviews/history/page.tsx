"use client";

import ReviewsList from "@/components/dashboard/review/reviews-list";
import { PageHeader } from "@/components/shared/page-header";

export default function ReviewerReviewHistoryPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Review workspace"
				title="Review history"
				description="Every review you have submitted, including scores and decisions."
			/>

			<ReviewsList emptyMessage="You have not submitted any reviews yet." />
		</div>
	);
}
