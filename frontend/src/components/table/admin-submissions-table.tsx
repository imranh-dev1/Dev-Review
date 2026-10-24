"use client";

import { ExternalLink, GitForkIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}

const statusStyles: Record<string, string> = {
	DRAFT: "bg-muted text-muted-foreground",
	SUBMITTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	IN_REVIEW: "bg-violet-500/10 text-violet-600 border-violet-500/20",
	CHANGES_REQUESTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
	RESUBMITTED: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
	APPROVED: "bg-green-500/10 text-green-600 border-green-500/20",
	REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
};

const formatStatus = (status: string) =>
	status
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const formatDate = (date: string | null | undefined) => {
	if (!date) return "Not submitted";

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(date));
};

export default function AdminSubmissionsTable({
	submissions,
	isPending = false,
}: AdminSubmissionsTableProps) {
	if (isPending) {
		return (
			<div className=" border">
				<div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
					Loading submissions...
				</div>
			</div>
		);
	}

	if (submissions.length === 0) {
		return (
			<div className="flex min-h-64 flex-col items-center justify-center  border border-dashed p-8 text-center">
				<div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
					<GitForkIcon className="size-6 text-muted-foreground" />
				</div>
				<h3 className="font-semibold">No submissions found</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					No submissions match your current search or filters.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden border">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="min-w-64">Project</TableHead>
							<TableHead className="min-w-52">Owner</TableHead>
							<TableHead className="min-w-48">Technologies</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="min-w-32">Submitted</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{submissions.map((submission) => (
							<TableRow key={submission.id}>
								<TableCell>
									<div className="max-w-72 space-y-1">
										<p className="line-clamp-2 font-medium">
											{submission.title}
										</p>
										<p className="line-clamp-2 text-xs text-muted-foreground">
											{submission.summary || "No summary provided"}
										</p>

										<div className="flex items-center gap-3 pt-1">
											<a
												href={submission.repositoryUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
												aria-label="Open repository"
											>
												<GitForkIcon className="size-3.5" />
												Repository
												<ExternalLink className="size-3" />
											</a>

											{submission.liveDemoUrl && (
												<a
													href={submission.liveDemoUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
													aria-label="Open live demo"
												>
													<ExternalLink className="size-3.5" />
													Live demo
												</a>
											)}
										</div>
									</div>
								</TableCell>

								<TableCell>
									<div className="space-y-1">
										<p className="font-medium">
											{submission.owner?.name ?? "Unknown user"}
										</p>
										<p className="text-xs text-muted-foreground">
											{submission.owner?.email ?? "No email"}
										</p>
									</div>
								</TableCell>

								<TableCell>
									<div className="flex max-w-52 flex-wrap gap-1.5">
										{(submission.technologies ?? []).length > 0 ? (
											<>
												{submission.technologies.slice(0, 2).map((tech) => (
													<Badge
														key={tech}
														variant="secondary"
														className="font-normal"
													>
														{tech}
													</Badge>
												))}

												{submission.technologies.length > 2 && (
													<Badge variant="outline">
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

								<TableCell>
									<Badge
										variant="outline"
										className={
											statusStyles[submission.status] ??
											"bg-muted text-muted-foreground"
										}
									>
										{formatStatus(submission.status)}
									</Badge>
								</TableCell>

								<TableCell className="text-sm text-muted-foreground">
									{formatDate(submission.submittedAt)}
								</TableCell>

								<TableCell className="text-right">
									<Button variant="ghost" size="sm" asChild>
										<Link href={`/admin/submissions/${submission.id}`}>
											View
											<MoreHorizontal className="ml-1 size-4" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
