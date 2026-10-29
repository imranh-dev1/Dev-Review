"use client";

import { CalendarDays, ExternalLink, GitFork, UserRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Submission } from "@/types";

interface AdminSubmissionsTableProps {
	submissions: Submission[];
	isPending?: boolean;
	detailBasePath?: string;
}

const statusStyles: Record<string, string> = {
	DRAFT: "border-muted bg-muted/60 text-muted-foreground",
	SUBMITTED:
		"border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
	IN_REVIEW:
		"border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
	CHANGES_REQUESTED:
		"border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
	RESUBMITTED:
		"border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
	APPROVED:
		"border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	REJECTED: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
};

const formatStatus = (status: string) =>
	status
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const formatDate = (date: string | null | undefined) => {
	if (!date) return "Not submitted";

	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "Invalid date";
	}

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(parsedDate);
};

function TableLoading() {
	return (
		<div className="overflow-hidden border">
			<div className="space-y-0">
				<div className="flex h-12 items-center gap-6 border-b bg-muted/40 px-5">
					<Skeleton className="h-3 w-24" />
					<Skeleton className="h-3 w-20" />
					<Skeleton className="h-3 w-24" />
					<Skeleton className="h-3 w-16" />
				</div>

				{[
					"submission-1",
					"submission-2",
					"submission-3",
					"submission-4",
					"submission-5",
				].map((key) => (
					<div
						key={key}
						className="flex items-center gap-6 border-b px-5 py-5 last:border-b-0"
					>
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-4 w-40 max-w-full" />
							<Skeleton className="h-3 w-56 max-w-full" />
						</div>
						<div className="hidden min-w-0 flex-1 space-y-2 md:block">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-3 w-36" />
						</div>
						<Skeleton className="h-6 w-20 rounded-full" />
						<Skeleton className="h-8 w-16" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function SubmissionsTable({
	submissions,
	isPending = false,
	detailBasePath = "/admin/submissions",
}: AdminSubmissionsTableProps) {
	if (isPending) {
		return <TableLoading />;
	}

	if (submissions.length === 0) {
		return (
			<div className="flex min-h-72 flex-col items-center justify-center border border-dashed bg-muted/10 px-6 py-12 text-center">
				<div className="mb-4 flex size-14 items-center justify-center border bg-background shadow-sm">
					<GitFork className="size-6 text-muted-foreground" />
				</div>

				<h3 className="text-base font-semibold">No submissions found</h3>

				<p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
					No projects match your current search or filters. Try changing your
					filters to see more results.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden border bg-card">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="border-b bg-muted/40 hover:bg-muted/40">
							<TableHead className="h-12 min-w-[280px] pl-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Project
							</TableHead>

							<TableHead className="h-12 min-w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Owner
							</TableHead>

							<TableHead className="h-12 min-w-[180px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Technologies
							</TableHead>

							<TableHead className="h-12 min-w-[160px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Status
							</TableHead>

							<TableHead className="h-12 min-w-[145px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Submitted
							</TableHead>

							<TableHead className="h-12 min-w-[100px] pr-5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{submissions.map((submission) => (
							<TableRow
								key={submission.id}
								className="group transition-colors hover:bg-muted/30"
							>
								{/* Project */}
								<TableCell className="py-4 pl-5">
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center border bg-muted/30 transition-colors group-hover:bg-background">
											<GitFork className="size-4 text-muted-foreground" />
										</div>

										<div className="min-w-0 max-w-[300px] space-y-1">
											<Link
												href={`${detailBasePath}/${submission.id}`}
												className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
											>
												{submission.title}
											</Link>

											<p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
												{submission.summary || "No summary provided"}
											</p>
										</div>
									</div>
								</TableCell>

								{/* Owner */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2.5">
										<div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted/40">
											<UserRound className="size-4 text-muted-foreground" />
										</div>

										<div className="min-w-0 space-y-1">
											<p className="max-w-[170px] truncate text-sm font-medium">
												{submission.owner?.name ?? "Unknown user"}
											</p>

											<p className="max-w-[170px] truncate text-xs text-muted-foreground">
												{submission.owner?.email ?? "No email"}
											</p>
										</div>
									</div>
								</TableCell>

								{/* Technologies */}
								<TableCell className="py-4">
									<div className="flex max-w-[200px] flex-wrap items-center gap-1.5">
										{(submission.technologies ?? []).length > 0 ? (
											<>
												{submission.technologies
													.slice(0, 2)
													.map((technology) => (
														<Badge
															key={technology}
															variant="secondary"
															className="rounded-md px-2 py-0.5 text-xs font-normal"
														>
															{technology}
														</Badge>
													))}

												{submission.technologies.length > 2 && (
													<Badge
														variant="outline"
														className="rounded-md px-2 py-0.5 text-xs font-normal text-muted-foreground"
													>
														+{submission.technologies.length - 2}
													</Badge>
												)}
											</>
										) : (
											<span className="text-xs text-muted-foreground">
												No technologies
											</span>
										)}
									</div>
								</TableCell>

								{/* Status */}
								<TableCell className="py-4">
									<Badge
										variant="outline"
										className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
											statusStyles[submission.status] ??
											"border-muted bg-muted text-muted-foreground"
										}`}
									>
										<span className="mr-1.5 size-1.5 shrink-0 rounded-full bg-current" />
										{formatStatus(submission.status)}
									</Badge>
								</TableCell>

								{/* Submitted */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<CalendarDays className="size-4 shrink-0" />

										<span className="whitespace-nowrap">
											{formatDate(submission.submittedAt)}
										</span>
									</div>
								</TableCell>

								{/* Actions */}
								<TableCell className="py-4 pr-5 text-right">
									<Button
										variant="outline"
										size="sm"
										asChild
										className="h-8 gap-1.5"
									>
										<Link href={`${detailBasePath}/${submission.id}`}>
											View
											<ExternalLink className="size-3.5" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col gap-2 border-t bg-muted/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<p className="text-xs text-muted-foreground">
					Showing{" "}
					<span className="font-medium text-foreground">
						{submissions.length}
					</span>{" "}
					submission{submissions.length !== 1 ? "s" : ""}
				</p>

				<p className="text-xs text-muted-foreground">
					Select a project to view its full details.
				</p>
			</div>
		</div>
	);
}
