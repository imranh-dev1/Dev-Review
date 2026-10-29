"use client";

import ReviewsList from "@/components/dashboard/review/reviews-list";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminReviewsPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title="Reviews"
				description="Browse every review submitted on the platform, with scores and decisions."
			/>

			<ReviewsList showReviewer submissionHrefBase="/admin/submissions" />
		</div>
	);
}
