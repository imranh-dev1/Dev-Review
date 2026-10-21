"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DataToolbar, FilterSelect } from "@/components/shared/data-toolbar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState, LoadingState } from "@/components/shared/state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useApiMeta } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";
import { SUBMISSION_STATUS_META } from "@/lib/status";
import type { Submission, SubmissionStatus } from "@/types";

const STATUS_OPTIONS = Object.entries(SUBMISSION_STATUS_META).map(
	([value, meta]) => ({ value, label: meta.label }),
);

export default function MySubmissionsPage() {
	const { user } = useAuth();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");

	const { data, meta, isLoading } = useApiMeta<Submission[]>(
		"/submissions/mine",
		{
			query: {
				page,
				limit: 10,
				search: search || undefined,
				status: (status as SubmissionStatus) || undefined,
			},
		},
	);

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
			<PageHeader
				eyebrow="Submissions"
				title="My submissions"
				description="Manage drafts, track reviews, and respond to requested changes."
				actions={
					<Button asChild size="sm">
						<Link href="/submissions/new">
							<Plus />
							New submission
						</Link>
					</Button>
				}
			/>

			<DataToolbar
				searchValue={search}
				onSearchChange={(value) => {
					setSearch(value);
					setPage(1);
				}}
				searchPlaceholder="Search by title"
				onReset={
					search || status
						? () => {
								setSearch("");
								setStatus("");
								setPage(1);
							}
						: undefined
				}
			>
				<FilterSelect
					label="Status"
					value={status}
					onChange={(value) => {
						setStatus(value);
						setPage(1);
					}}
					options={STATUS_OPTIONS}
					allLabel="All statuses"
				/>
			</DataToolbar>

			<Card className="border-border">
				<CardHeader>
					<p className="text-sm font-semibold">All submissions</p>
					<p className="text-xs text-muted-foreground">
						{meta?.total ?? 0} result{meta?.total === 1 ? "" : "s"}
					</p>
				</CardHeader>
				<CardContent className="flex flex-col gap-0 p-0">
					{isLoading ? (
						<div className="p-4">
							<LoadingState label="Loading submissions" />
						</div>
					) : data && data.length > 0 ? (
						<div className="divide-y divide-border">
							{data.map((submission) => {
								const metaStatus = SUBMISSION_STATUS_META[submission.status];
								return (
									<Link
										key={submission.id}
										href={`/submissions/${submission.id}`}
										className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
									>
										<div className="flex min-w-0 flex-col gap-1">
											<p className="truncate text-sm font-medium">
												{submission.title}
											</p>
											<p className="truncate text-xs text-muted-foreground">
												{submission.summary}
											</p>
										</div>
										<div className="flex flex-wrap items-center gap-2">
											<StatusBadge
												label={metaStatus.label}
												tone={metaStatus.tone}
											/>
											<span className="text-xs text-muted-foreground">
												Updated {formatDate(submission.updatedAt)}
											</span>
										</div>
									</Link>
								);
							})}
						</div>
					) : (
						<div className="p-4">
							<EmptyState
								title="No submissions found"
								description={
									search || status
										? "Try adjusting your filters."
										: "Start by creating your first project submission."
								}
								action={
									!search && !status ? (
										<Button asChild size="sm">
											<Link href="/submissions/new">
												<Plus />
												New submission
											</Link>
										</Button>
									) : undefined
								}
							/>
						</div>
					)}

					{meta ? (
						<div className="px-4 pb-4">
							<Pagination
								page={meta.page}
								totalPages={meta.totalPages}
								total={meta.total}
								limit={meta.limit}
								onPageChange={setPage}
							/>
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
