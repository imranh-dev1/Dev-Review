"use client";

import { ArrowLeft, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import AuthLoading from "@/components/auth/auth-loading";
import ReviewForm from "@/components/dashboard/review/review-form";
import SubmissionDetails from "@/components/dashboard/submissions/submission-details";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useGetAssignments, useStartReview } from "@/hooks/assignment.hook";
import { useSubmissionDetails } from "@/hooks/submission.hook";

export default function ReviewerSubmissionDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading } = useSubmissionDetails(id);
	const { data: assignmentsData } = useGetAssignments({
		submissionId: id,
		limit: 100,
	});
	const startReview = useStartReview();

	const submission = data?.data;
	const assignment = assignmentsData?.data?.find(
		(item: { status: string }) => item.status !== "CANCELLED",
	);

	if (isLoading || !submission) {
		return <AuthLoading value="Loading submission..." />;
	}

	const canStart =
		Boolean(assignment) &&
		["SUBMITTED", "RESUBMITTED"].includes(submission.status as string);

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Review workspace"
				title={submission.title}
				description="Review the project details, then submit scores and feedback."
				actions={
					<Button asChild variant="outline">
						<Link href="/reviewer/assignments">
							<ArrowLeft className="mr-2 size-4" />
							Back to assignments
						</Link>
					</Button>
				}
			/>

			{canStart ? (
				<div className="flex flex-col gap-3 border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium">Ready to begin?</p>
						<p className="text-xs text-muted-foreground">
							Start the review to unlock the scoring form and notify the
							student.
						</p>
					</div>

					<Button
						disabled={startReview.isPending}
						onClick={() =>
							startReview.mutate(id, {
								onSuccess: () => toast.success("Review started."),
								onError: (error: Error) => toast.error(error.message),
							})
						}
					>
						{startReview.isPending ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<Play className="mr-2 size-4" />
						)}
						Start review
					</Button>
				</div>
			) : null}

			<SubmissionDetails submission={submission} />

			{submission.status === "IN_REVIEW" ? (
				<ReviewForm submissionId={id} />
			) : (
				<div className="border border-dashed p-6 text-center text-sm text-muted-foreground">
					{canStart
						? "Start the review to submit scores and feedback."
						: "This submission is not currently open for review."}
				</div>
			)}
		</div>
	);
}
