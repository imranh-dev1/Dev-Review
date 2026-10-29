"use client";

import { Check, ExternalLink, Loader2, Play, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import DataPagination from "@/components/shared/pagination";
import { ListSkeleton } from "@/components/shared/state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	useAcceptAssignment,
	useCancelAssignment,
	useGetAssignments,
	useStartReview,
} from "@/hooks";
import type { Assignment, AssignmentStatus } from "@/types";

function formatStatus(status: string) {
	return status
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function formatDate(value?: string | null) {
	if (!value) return "—";

	return new Date(value).toLocaleDateString(undefined, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function AssignmentsList({
	viewerRole,
	statuses,
	emptyMessage = "No assignments found.",
}: {
	viewerRole: "REVIEWER" | "ADMIN";
	statuses?: AssignmentStatus[];
	emptyMessage?: string;
}) {
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isPending, isError } = useGetAssignments({
		page,
		limit,
		...(statuses?.length === 1 ? { status: statuses[0] } : {}),
	});
	const accept = useAcceptAssignment();
	const start = useStartReview();
	const cancel = useCancelAssignment();

	const assignments: Assignment[] =
		data?.data?.filter((assignment: Assignment) =>
			statuses?.length ? statuses.includes(assignment.status) : true,
		) ?? [];
	const meta = data?.meta;

	return (
		<div className="space-y-4">
			{isPending ? (
				<ListSkeleton items={4} />
			) : isError ? (
				<p className="border border-dashed p-10 text-center text-sm text-destructive">
					Failed to load assignments.
				</p>
			) : assignments.length === 0 ? (
				<p className="border border-dashed p-10 text-center text-sm text-muted-foreground">
					{emptyMessage}
				</p>
			) : (
				<div className="grid gap-3">
					{assignments.map((assignment) => {
						const submission = assignment.submission;

						return (
							<Card key={assignment.id} className="py-0">
								<CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="min-w-0 space-y-1.5">
										<div className="flex flex-wrap items-center gap-2">
											<p className="truncate font-semibold">
												{submission?.title ?? "Untitled submission"}
											</p>
											<Badge variant="outline">
												{formatStatus(assignment.status)}
											</Badge>
											{viewerRole === "ADMIN" && assignment.reviewer ? (
												<Badge variant="secondary">
													{assignment.reviewer.name}
												</Badge>
											) : null}
										</div>

										<p className="line-clamp-2 text-sm text-muted-foreground">
											{submission?.summary ?? "No summary available."}
										</p>

										<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
											<span>Assigned {formatDate(assignment.assignedAt)}</span>
											{submission?.owner ? (
												<span>Student: {submission.owner.name}</span>
											) : null}
											{submission?.status ? (
												<span>
													Submission: {formatStatus(submission.status)}
												</span>
											) : null}
										</div>
									</div>

									<div className="flex flex-wrap items-center gap-2 sm:shrink-0">
										{viewerRole === "REVIEWER" &&
										assignment.status === "ASSIGNED" ? (
											<Button
												size="sm"
												variant="outline"
												disabled={accept.isPending}
												onClick={() =>
													accept.mutate(assignment.id, {
														onSuccess: () =>
															toast.success("Assignment accepted."),
														onError: (error: Error) =>
															toast.error(error.message),
													})
												}
											>
												<Check className="mr-1.5 size-4" />
												Accept
											</Button>
										) : null}

										{viewerRole === "REVIEWER" &&
										submission &&
										["SUBMITTED", "RESUBMITTED"].includes(
											submission.status as string,
										) ? (
											<Button
												size="sm"
												variant="outline"
												disabled={start.isPending}
												onClick={() =>
													start.mutate(assignment.submissionId, {
														onSuccess: () => toast.success("Review started."),
														onError: (error: Error) =>
															toast.error(error.message),
													})
												}
											>
												<Play className="mr-1.5 size-4" />
												Start review
											</Button>
										) : null}

										{viewerRole === "REVIEWER" ? (
											<Button size="sm" asChild>
												<Link
													href={`/reviewer/submissions/${assignment.submissionId}`}
												>
													{assignment.status === "COMPLETED"
														? "View"
														: "Review"}
													<ExternalLink className="ml-1.5 size-4" />
												</Link>
											</Button>
										) : null}

										{viewerRole === "ADMIN" &&
										["ASSIGNED", "ACCEPTED"].includes(assignment.status) ? (
											<Button
												size="sm"
												variant="outline"
												disabled={cancel.isPending}
												onClick={() =>
													cancel.mutate(assignment.id, {
														onSuccess: () =>
															toast.success("Assignment cancelled."),
														onError: (error: Error) =>
															toast.error(error.message),
													})
												}
											>
												<X className="mr-1.5 size-4" />
												Cancel
											</Button>
										) : null}

										{viewerRole === "ADMIN" ? (
											<Button size="sm" asChild variant="outline">
												<Link
													href={`/admin/submissions/${assignment.submissionId}`}
												>
													View
													<ExternalLink className="ml-1.5 size-4" />
												</Link>
											</Button>
										) : null}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{accept.isPending || start.isPending || cancel.isPending ? (
				<p className="flex items-center gap-2 text-xs text-muted-foreground">
					<Loader2 className="size-3 animate-spin" />
					Updating assignment...
				</p>
			) : null}

			{!isError ? (
				<DataPagination
					content="assignments"
					page={meta?.page ?? page}
					totalPages={meta?.totalPages ?? 0}
					total={meta?.total ?? 0}
					limit={meta?.limit ?? limit}
					isPending={isPending}
					onPageChange={setPage}
				/>
			) : null}
		</div>
	);
}
