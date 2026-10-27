"use client";

import {
	ArrowUpRight,
	CheckCircle2,
	Clock3,
	ExternalLink,
	FileCode2,
	FolderGit2,
	Plus,
	RefreshCw,
	Search,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import DataPagination from "@/components/shared/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMySubmissions } from "@/hooks/submission.hook";
import type { Submission } from "@/types";
import UpdateSubmissionDialog from "@/components/dialog/update-submission-dilog";
import DeleteSubmissionDialog from "@/components/dialog/delete-submission-dialog";

interface SubmissionListProps {
	title?: string;
	description?: string;
	createHref?: string;
	detailBasePath?: string;
}

const statuses = {
	DRAFT: {
		label: "Draft",
		className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
		icon: FileCode2,
	},
	SUBMITTED: {
		label: "Submitted",
		className: "border-blue-500/30 bg-blue-500/10 text-blue-400",
		icon: Clock3,
	},
	IN_REVIEW: {
		label: "In Review",
		className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
		icon: Clock3,
	},
	CHANGES_REQUESTED: {
		label: "Changes Requested",
		className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
		icon: RefreshCw,
	},
	RESUBMITTED: {
		label: "Resubmitted",
		className: "border-purple-500/30 bg-purple-500/10 text-purple-400",
		icon: RefreshCw,
	},
	APPROVED: {
		label: "Approved",
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
		icon: CheckCircle2,
	},
	REJECTED: {
		label: "Rejected",
		className: "border-red-500/30 bg-red-500/10 text-red-400",
		icon: XCircle,
	},
} as const;

const statusOptions = Object.entries(statuses).map(([value, status]) => ({
	value,
	label: status.label,
}));

export function SubmissionList({
	title = "My Submissions",
	description = "Manage your projects and track their review progress.",
	createHref,
	detailBasePath = "/student/submissions",
}: SubmissionListProps) {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<keyof typeof statuses | "">("");
	const [page, setPage] = useState(1);

	const limit = 10;

	const {
		data: response,
		isPending,
		isError,
	} = useGetMySubmissions({
		page,
		limit,
		...(search ? { search } : {}),
		...(status ? { status } : {}),
	});

	const submissions: Submission[] = response?.data ?? [];

	const meta = response?.meta;

	const stats = [
		{
			label: "Total",
			value: meta?.total ?? 0,
			icon: FileCode2,
		},
		{
			label: "In Review",
			value: submissions.filter((item) => item.status === "IN_REVIEW").length,
			icon: Clock3,
		},
		{
			label: "Approved",
			value: submissions.filter((item) => item.status === "APPROVED").length,
			icon: CheckCircle2,
		},
		{
			label: "Changes Requested",
			value: submissions.filter((item) => item.status === "CHANGES_REQUESTED")
				.length,
			icon: RefreshCw,
		},
	];

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const handleStatusChange = (value: string) => {
		setStatus(value === "ALL" ? "" : (value as keyof typeof statuses));
		setPage(1);
	};

	return (
		<div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
			{/* Page Header */}
			<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						{title}
					</h1>

					<p className="mt-2 text-sm text-muted-foreground">{description}</p>
				</div>

				{createHref && (
					<Button asChild className="w-full sm:w-auto">
						<Link href={createHref}>
							<Plus className="mr-2 size-4" />
							New Submission
						</Link>
					</Button>
				)}
			</header>

			{/* Statistics */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map(({ label, value, icon: Icon }) => (
					<Card key={label} className="py-0">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">{label}</p>
								<Icon className="size-5 text-primary" />
							</div>

							<p className="mt-3 text-3xl font-semibold">{value}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Search and Status Filter */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						value={search}
						onChange={(event) => handleSearchChange(event.target.value)}
						placeholder="Search submissions..."
						className="pl-9"
					/>
				</div>

				<Select value={status || "ALL"} onValueChange={handleStatusChange}>
					<SelectTrigger
						aria-label="Filter submissions by status"
						className="h-10 w-full sm:w-[200px]"
					>
						<SelectValue placeholder="All statuses" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>

						{statusOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Projects */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold">Projects</h2>

					<span className="text-sm text-muted-foreground">
						{meta?.total ?? 0} submissions
					</span>
				</div>

				{isPending ? (
					<div className="grid gap-4 lg:grid-cols-2">
						{["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map(
							(key) => (
								<Card key={key} className="h-56 py-0">
									<CardContent className="space-y-4 p-5">
										<Skeleton className="h-5 w-2/3" />
										<Skeleton className="h-4 w-1/3" />
										<Skeleton className="h-12 w-full" />
										<Skeleton className="h-6 w-1/2" />
										<Skeleton className="h-8 w-full" />
									</CardContent>
								</Card>
							),
						)}
					</div>
				) : isError ? (
					<Alert variant="destructive" className="p-10 text-center">
						<AlertTitle>Failed to load submissions</AlertTitle>
						<AlertDescription>Please try again later.</AlertDescription>
					</Alert>
				) : submissions.length === 0 ? (
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center p-10 text-center sm:p-16">
							<FileCode2 className="size-10 text-muted-foreground" />

							<h3 className="mt-4 font-semibold">
								{search || status
									? "No matching submissions"
									: "No submissions yet"}
							</h3>

							<p className="mt-2 text-sm text-muted-foreground">
								{search || status
									? "Try another search or status."
									: "Create your first project submission."}
							</p>

							{!search && !status && createHref && (
								<Button asChild className="mt-5">
									<Link href={createHref}>
										<Plus className="mr-2 size-4" />
										Create Submission
									</Link>
								</Button>
							)}
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 lg:grid-cols-2">
						{submissions.map((submission) => {
							const config =
								statuses[submission.status as keyof typeof statuses];

							const StatusIcon = config?.icon ?? Clock3;

							return (
								<Card
									key={submission.id}
									className="flex flex-col py-0 transition-colors hover:border-primary/40"
								>
									<CardHeader className="p-5 pb-0 sm:p-6 sm:pb-0">
										<div className="flex items-start justify-between gap-3">
											<div className="flex min-w-0 items-start gap-3">
												<div className="flex size-11 shrink-0 items-center justify-center bg-primary/10">
													<FileCode2 className="size-5 text-primary" />
												</div>

												<div className="min-w-0">
													<h3 className="line-clamp-2 font-semibold">
														{submission.title}
													</h3>

													<p className="mt-1 text-xs text-muted-foreground">
														Updated{" "}
														{new Date(
															submission.updatedAt,
														).toLocaleDateString()}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<Badge
													variant="outline"
													className={`shrink-0 ${config?.className ?? ""}`}
												>
													<StatusIcon className="mr-1 size-3" />
													{config?.label ?? submission.status}
												</Badge>
												<DeleteSubmissionDialog
													submissionId={submission.id}
													submissionTitle={submission.title}
												/>
											</div>
										</div>
									</CardHeader>

									<CardContent className="flex flex-1 flex-col p-5 sm:p-6">
										<p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
											{submission.summary}
										</p>

										<div className="mt-4 flex flex-wrap gap-2">
											{submission.technologies.map((technology) => (
												<Badge key={technology} variant="secondary">
													{technology}
												</Badge>
											))}
										</div>

										<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
											<div className="flex flex-wrap gap-3">
												<Button
													asChild
													variant="link"
													size="sm"
													className="h-auto gap-1.5 p-0 text-sm text-muted-foreground hover:text-primary"
												>
													<a
														href={submission.repositoryUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														<FolderGit2 className="size-4" />
														Repository
														<ExternalLink className="size-3" />
													</a>
												</Button>

												{submission.liveDemoUrl && (
													<Button
														asChild
														variant="link"
														size="sm"
														className="h-auto gap-1.5 p-0 text-sm text-muted-foreground hover:text-primary"
													>
														<a
															href={submission.liveDemoUrl}
															target="_blank"
															rel="noopener noreferrer"
														>
															<ArrowUpRight className="size-4" />
															Live Demo
														</a>
													</Button>
												)}
											</div>

											<div className="flex items-center gap-2">
												<UpdateSubmissionDialog id={submission.id} />

												<Button asChild variant="default" size="sm">
													<Link href={`${detailBasePath}/${submission.id}`}>
														View Details
														<ArrowUpRight className="ml-1 size-4" />
													</Link>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}

				{/* Pagination */}
				{!isError && (
					<DataPagination
						content="Projects"
						page={meta?.page ?? page}
						totalPages={meta?.totalPages ?? 0}
						total={meta?.total ?? 0}
						limit={meta?.limit ?? limit}
						isPending={isPending}
						onPageChange={setPage}
					/>
				)}
			</section>
		</div>
	);
}
