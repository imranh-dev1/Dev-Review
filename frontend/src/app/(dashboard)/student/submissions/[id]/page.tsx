"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import SubmissionDetails from "@/components/dashboard/submissions/submission-details";
import { PageHeader } from "@/components/shared/page-header";
import { DetailSkeleton, ErrorState } from "@/components/shared/state";
import { Button } from "@/components/ui/button";
import { useSubmissionDetails } from "@/hooks/submission.hook";

export default function SubmissionDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, isError, refetch } = useSubmissionDetails(id);

	const submission = data?.data;

	if (isLoading) {
		return <DetailSkeleton />;
	}

	if (isError) {
		return (
			<div className="space-y-6">
				<PageHeader
					eyebrow="My projects"
					title="Submission details"
					description="View your project, its review progress, and reviewer feedback."
					actions={
						<Button asChild variant="outline">
							<Link href="/student/submissions/my-submissions">
								<ArrowLeft className="mr-2 size-4" />
								Back to submissions
							</Link>
						</Button>
					}
				/>

				<ErrorState
					title="Unable to load this submission"
					message="The submission could not be found, or you may not have access to it."
					onRetry={() => refetch()}
				/>
			</div>
		);
	}

	if (!submission) {
		return (
			<div className="space-y-6">
				<PageHeader
					eyebrow="My projects"
					title="Submission details"
					description="View your project, its review progress, and reviewer feedback."
				/>

				<ErrorState
					title="Submission not found"
					message="This submission may have been deleted or is no longer available."
					onRetry={() => refetch()}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="My projects"
				title={submission.title}
				description="Review the project details, status history, and feedback."
				actions={
					<Button asChild variant="outline">
						<Link href="/student/submissions/my-submissions">
							<ArrowLeft className="mr-2 size-4" />
							Back to submissions
						</Link>
					</Button>
				}
			/>

			<SubmissionDetails submission={submission} />

			<Button asChild variant="ghost" size="sm" className="w-fit">
				<Link href="/student/submissions/my-submissions">
					<RefreshCw className="mr-2 size-3.5" />
					Return to all submissions
				</Link>
			</Button>
		</div>
	);
}
