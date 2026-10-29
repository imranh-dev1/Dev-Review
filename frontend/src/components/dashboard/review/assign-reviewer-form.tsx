"use client";

import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAssignReviewer } from "@/hooks/assignment.hook";
import { useListAllSubmissions } from "@/hooks/submission.hook";
import { useGetAllUsers } from "@/hooks/user.hook";
import type { IUser, Submission } from "@/types";

export default function AssignReviewerForm() {
	const [submissionId, setSubmissionId] = useState("");
	const [reviewerId, setReviewerId] = useState("");

	const { data: submissionsData } = useListAllSubmissions({
		page: 1,
		limit: 100,
	});
	const { data: reviewersData } = useGetAllUsers({
		role: "REVIEWER",
		status: "ACTIVE",
		limit: 100,
	});
	const assign = useAssignReviewer();

	const submissions: Submission[] = (submissionsData?.data ?? []).filter(
		(submission: Submission) =>
			["SUBMITTED", "IN_REVIEW", "RESUBMITTED"].includes(submission.status),
	);
	const reviewers: IUser[] = reviewersData?.data ?? [];

	const handleAssign = () => {
		if (!submissionId || !reviewerId) {
			toast.error("Select both a submission and a reviewer.");
			return;
		}

		assign.mutate(
			{ submissionId, reviewerId },
			{
				onSuccess: () => {
					toast.success("Reviewer assigned successfully.");
					setSubmissionId("");
					setReviewerId("");
				},
				onError: (error: Error) => toast.error(error.message),
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<UserPlus className="size-4 text-primary" />
					Assign a reviewer
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-4 lg:flex-row lg:items-end">
				<div className="flex-1 space-y-1.5">
					<Label>Submission</Label>
					<Select value={submissionId} onValueChange={setSubmissionId}>
						<SelectTrigger>
							<SelectValue placeholder="Select a submission" />
						</SelectTrigger>
						<SelectContent>
							{submissions.length === 0 ? (
								<SelectItem value="none" disabled>
									No submissions available
								</SelectItem>
							) : (
								submissions.map((submission) => (
									<SelectItem key={submission.id} value={submission.id}>
										{submission.title}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1 space-y-1.5">
					<Label>Reviewer</Label>
					<Select value={reviewerId} onValueChange={setReviewerId}>
						<SelectTrigger>
							<SelectValue placeholder="Select a reviewer" />
						</SelectTrigger>
						<SelectContent>
							{reviewers.length === 0 ? (
								<SelectItem value="none" disabled>
									No active reviewers found
								</SelectItem>
							) : (
								reviewers.map((reviewer) => (
									<SelectItem key={reviewer.id} value={reviewer.id}>
										{reviewer.name} ({reviewer.email})
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				<Button onClick={handleAssign} disabled={assign.isPending}>
					{assign.isPending ? (
						<Loader2 className="mr-2 size-4 animate-spin" />
					) : (
						<UserPlus className="mr-2 size-4" />
					)}
					Assign
				</Button>
			</CardContent>
		</Card>
	);
}
