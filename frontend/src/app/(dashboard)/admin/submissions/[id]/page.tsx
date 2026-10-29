"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import SubmissionDetails from "@/components/dashboard/submissions/submission-details";
import { PageHeader } from "@/components/shared/page-header";
import { DetailSkeleton, ErrorState } from "@/components/shared/state";
import { Button } from "@/components/ui/button";
import { useSubmissionDetails } from "@/hooks/submission.hook";

export default function AdminSubmissionDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading, isError, refetch } = useSubmissionDetails(id);

	const submission = data?.data;

	if (isLoading) {
		return <DetailSkeleton />;
	}

	if (isError || !submission) {
		return (
			<div className="space-y-6">
				<PageHeader
					eyebrow="Management"
					title="Submission details"
					description="Inspect the project, its review history, and reviewer feedback."
					actions={
						<Button asChild variant="outline">
							<Link href="/admin/submissions">
								<ArrowLeft className="mr-2 size-4" />
								Back to submissions
							</Link>
						</Button>
					}
				/>

				<ErrorState
					title="Unable to load this submission"
					message="The submission could not be found or may have been deleted."
					onRetry={() => refetch()}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title={submission.title}
				description={`Owned by ${submission.owner?.name ?? "an unknown user"}.`}
				actions={
					<Button asChild variant="outline">
						<Link href="/admin/submissions">
							<ArrowLeft className="mr-2 size-4" />
							Back to submissions
						</Link>
					</Button>
				}
			/>

			<SubmissionDetails submission={submission} />
		</div>
	);
}
