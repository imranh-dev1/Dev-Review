"use client";

import { useState } from "react";

import { DataToolbar, FilterSelect } from "@/components/shared/data-toolbar";
import { PageHeader } from "@/components/shared/page-header";
import DataPagination from "@/components/shared/pagination";
import { ErrorState } from "@/components/shared/state";
import SubmissionsTable from "@/components/table/submissions-table";
import { Badge } from "@/components/ui/badge";
import { useListAllSubmissions } from "@/hooks/submission.hook";
import type { Submission, SubmissionStatus } from "@/types";

const statusOptions = [
	"DRAFT",
	"SUBMITTED",
	"IN_REVIEW",
	"CHANGES_REQUESTED",
	"RESUBMITTED",
	"APPROVED",
	"REJECTED",
] as const satisfies readonly SubmissionStatus[];

const formatStatus = (value: string) =>
	value
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export default function AdminSubmissionsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string>("");
	const [page, setPage] = useState(1);

	const limit = 10;

	const {
		data: response,
		isPending,
		isError,
		refetch,
	} = useListAllSubmissions({
		page,
		limit,
		...(search.trim() ? { search: search.trim() } : {}),
		...(status ? { status: status as SubmissionStatus } : {}),
	});

	const submissions: Submission[] = response?.data ?? [];
	const meta = response?.meta;
	const hasFilters = search.length > 0 || status !== "";

	const clearFilters = () => {
		setSearch("");
		setStatus("");
		setPage(1);
	};

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title="All submissions"
				description="Manage and monitor project submissions across DevReview."
				actions={
					<Badge variant="secondary" className="h-7 px-3">
						{meta?.total ?? 0} submissions
					</Badge>
				}
			/>

			<DataToolbar
				searchValue={search}
				onSearchChange={(value) => {
					setSearch(value);
					setPage(1);
				}}
				searchPlaceholder="Search projects by title..."
				onReset={hasFilters ? clearFilters : undefined}
			>
				<FilterSelect
					label="Status"
					value={status}
					onChange={(value) => {
						setStatus(value);
						setPage(1);
					}}
					options={statusOptions.map((item) => ({
						value: item,
						label: formatStatus(item),
					}))}
					allLabel="All statuses"
				/>
			</DataToolbar>

			{isError ? (
				<ErrorState
					title="Failed to load submissions"
					message="We could not fetch submissions right now. Please try again."
					onRetry={() => refetch()}
				/>
			) : (
				<>
					<SubmissionsTable submissions={submissions} isPending={isPending} />

					<DataPagination
						content="Projects"
						page={meta?.page ?? page}
						totalPages={meta?.totalPages ?? 0}
						total={meta?.total ?? 0}
						limit={meta?.limit ?? limit}
						isPending={isPending}
						onPageChange={setPage}
					/>
				</>
			)}
		</div>
	);
}
