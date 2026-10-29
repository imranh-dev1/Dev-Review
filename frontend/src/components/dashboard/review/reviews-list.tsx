"use client";

import { MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import DataPagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetReviews } from "@/hooks/review.hook";
import type { Review, ReviewDecision } from "@/types";

const decisionStyles: Record<string, string> = {
	APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
	REJECTED: "border-red-500/30 bg-red-500/10 text-red-600",
	CHANGES_REQUESTED: "border-amber-500/30 bg-amber-500/10 text-amber-600",
};

const scoreFields = [
	{ key: "codeQuality", label: "Code" },
	{ key: "functionality", label: "Function" },
	{ key: "uiUx", label: "UI/UX" },
	{ key: "responsiveness", label: "Responsive" },
	{ key: "accessibility", label: "A11y" },
	{ key: "documentation", label: "Docs" },
] as const;

function formatDecision(decision: string) {
	return decision
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function ReviewsList({
	showReviewer = false,
	submissionHrefBase,
	emptyMessage = "No reviews found.",
}: {
	showReviewer?: boolean;
	submissionHrefBase?: string;
	emptyMessage?: string;
}) {
	const [page, setPage] = useState(1);
	const [decision, setDecision] = useState<ReviewDecision | "">("");
	const limit = 10;

	const { data, isPending, isError } = useGetReviews({
		page,
		limit,
		...(decision ? { decision } : {}),
	});

	const reviews: Review[] = data?.data ?? [];
	const meta = data?.meta;

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MessageSquareText className="size-4" />
					{meta?.total ?? 0} review{meta?.total === 1 ? "" : "s"}
				</div>

				<div className="flex items-center gap-2">
					<Label className="text-xs text-muted-foreground">Decision</Label>
					<Select
						value={decision || "ALL"}
						onValueChange={(value) => {
							setDecision(value === "ALL" ? "" : (value as ReviewDecision));
							setPage(1);
						}}
					>
						<SelectTrigger className="w-44">
							<SelectValue placeholder="All decisions" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">All decisions</SelectItem>
							<SelectItem value="APPROVED">Approved</SelectItem>
							<SelectItem value="CHANGES_REQUESTED">
								Changes requested
							</SelectItem>
							<SelectItem value="REJECTED">Rejected</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isPending ? (
				<p className="border border-dashed p-10 text-center text-sm text-muted-foreground">
					Loading reviews...
				</p>
			) : isError ? (
				<p className="border border-dashed p-10 text-center text-sm text-destructive">
					Failed to load reviews.
				</p>
			) : reviews.length === 0 ? (
				<p className="border border-dashed p-10 text-center text-sm text-muted-foreground">
					{emptyMessage}
				</p>
			) : (
				<div className="grid gap-3">
					{reviews.map((review) => (
						<Card key={review.id} className="py-0">
							<CardContent className="space-y-3 p-4">
								<div className="flex flex-wrap items-start justify-between gap-2">
									<div className="min-w-0 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											{submissionHrefBase && review.submission ? (
												<Link
													href={`${submissionHrefBase}/${review.submission.id}`}
													className="truncate font-semibold hover:text-primary"
												>
													{review.submission.title}
												</Link>
											) : (
												<p className="truncate font-semibold">
													{review.submission?.title ?? "Project review"}
												</p>
											)}
											<Badge
												variant="outline"
												className={decisionStyles[review.decision] ?? ""}
											>
												{formatDecision(review.decision)}
											</Badge>
											{showReviewer ? (
												<Badge variant="secondary">
													{review.reviewer?.name ?? "Reviewer"}
												</Badge>
											) : null}
										</div>
										<p className="text-xs text-muted-foreground">
											{new Date(review.createdAt).toLocaleString(undefined, {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</p>
									</div>

									<div className="flex items-center gap-1.5 text-sm font-semibold">
										<Star className="size-4 fill-amber-400 text-amber-400" />
										{Number(review.overallScore).toFixed(2)}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
									{scoreFields.map(({ key, label }) => (
										<div key={key} className="border bg-muted/20 px-2 py-1.5">
											<p className="text-[10px] uppercase tracking-wide text-muted-foreground">
												{label}
											</p>
											<p className="text-sm font-medium">{review[key]}/10</p>
										</div>
									))}
								</div>

								<p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
									{review.feedback}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!isError ? (
				<DataPagination
					content="reviews"
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
