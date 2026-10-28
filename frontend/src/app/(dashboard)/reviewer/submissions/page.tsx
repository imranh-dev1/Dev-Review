"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useListAllSubmissions } from "@/hooks/submission.hook";
import type { Submission, SubmissionStatus } from "@/types";
import DataPagination from "@/components/shared/pagination";
import SubmissionsTable from "@/components/table/submissions-table";

const statusOptions = [
	"DRAFT",
	"SUBMITTED",
	"IN_REVIEW",
	"CHANGES_REQUESTED",
	"RESUBMITTED",
	"APPROVED",
	"REJECTED",
] as const satisfies readonly SubmissionStatus[];

export default function ReviewerSubmissionsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string>("ALL");
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
		...(status !== "ALL" ? { status: status as SubmissionStatus } : {}),
	});

	const submissions: Submission[] = response?.data ?? [];
	const meta = response?.meta;

	const hasFilters = search.length > 0 || status !== "ALL";

	const clearFilters = () => {
		setSearch("");
		setStatus("ALL");
		setPage(1);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold tracking-tight">All Submissions</h1>
					<p className="text-sm text-muted-foreground">
						Manage and monitor project submissions across DevReview.
					</p>
				</div>

				<Badge variant="secondary" className="w-fit px-3 py-1">
					{meta?.total ?? 0} submissions
				</Badge>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
						placeholder="Search projects by title..."
						className="pl-9"
					/>
				</div>

				<Select
					value={status}
					onValueChange={(value) => {
						setStatus(value);
						setPage(1);
					}}
				>
					<SelectTrigger className="w-full sm:w-52">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>
						{statusOptions.map((item) => (
							<SelectItem key={item} value={item}>
								{item
									.toLowerCase()
									.split("_")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button variant="ghost" onClick={clearFilters}>
						<X className="mr-2 size-4" />
						Clear
					</Button>
				)}
			</div>

			{isError ? (
				<div className="flex flex-col items-center gap-3 border border-dashed p-10 text-center">
					<p className="text-sm text-muted-foreground">
						Failed to load submissions. Please try again.
					</p>
					<Button variant="outline" onClick={() => refetch()}>
						Try again
					</Button>
				</div>
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
