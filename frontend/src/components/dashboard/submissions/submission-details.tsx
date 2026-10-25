"use client";

import {
	CalendarDays,
	Clock3,
	ExternalLink,
	FileText,
	GitBranch,
	Image as ImageIcon,
	Layers3,
	UserRound,
} from "lucide-react";

import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubmissionDetail } from "@/types";
import Link from "next/link";

interface SubmissionDetailsProps {
	submission: SubmissionDetail;
}

const statusStyles: Record<string, string> = {
	DRAFT: "border-muted-foreground/30 bg-muted text-muted-foreground",
	SUBMITTED: "border-blue-500/30 bg-blue-500/10 text-blue-600",
	IN_REVIEW: "border-purple-500/30 bg-purple-500/10 text-purple-600",
	CHANGES_REQUESTED: "border-orange-500/30 bg-orange-500/10 text-orange-600",
	RESUBMITTED: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600",
	APPROVED: "border-green-500/30 bg-green-500/10 text-green-600",
	REJECTED: "border-red-500/30 bg-red-500/10 text-red-600",
};

function formatDate(date?: string | Date | null) {
	if (!date) return "Not available";

	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) return "Not available";

	return parsedDate.toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function getInitials(name?: string | null) {
	if (!name) return "U";

	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

function SectionTitle({
	icon: Icon,
	children,
}: {
	icon: React.ElementType;
	children: React.ReactNode;
}) {
	return (
		<CardTitle className="flex items-center gap-2 text-base">
			<Icon className="size-4 text-primary" />
			{children}
		</CardTitle>
	);
}

export default function SubmissionDetails({
	submission,
}: SubmissionDetailsProps) {
	const technologies = submission.technologies ?? [];
	const screenshots = submission.screenshots ?? [];
	const reviews = submission?.reviews ?? [];
	const statusHistory = submission.statusHistory ?? [];
	const assignments = submission.assignments ?? [];
	const owner = submission.owner;

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			{/* Header */}
			<header className="space-y-3">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline">Project Submission</Badge>

					<Badge
						variant="outline"
						className={statusStyles[submission.status] ?? ""}
					>
						{submission.status.replaceAll("_", " ")}
					</Badge>
				</div>

				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					{submission.title}
				</h1>

				<p className="max-w-3xl text-sm leading-6 text-muted-foreground">
					{submission.summary ||
						submission.description ||
						"No summary provided."}
				</p>
			</header>

			<Separator />

			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
				{/* Main Content */}
				<div className="min-w-0 space-y-6">
					{/* Overview */}
					<Card>
						<CardHeader>
							<SectionTitle icon={FileText}>Project Overview</SectionTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Description</h3>
								<p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
									{submission.description || "No description provided."}
								</p>
							</div>

							<Separator />

							<div className="space-y-2">
								<h3 className="text-sm font-medium">Technologies</h3>

								{technologies.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{technologies.map((technology, index) => (
											<Badge key={technology} variant="secondary">
												{technology}
											</Badge>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										No technologies specified.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Project Links */}
					<Card>
						<CardHeader>
							<SectionTitle icon={ExternalLink}>Project Links</SectionTitle>
						</CardHeader>

						<CardContent className="space-y-3">
							{submission.repositoryUrl && (
								<a
									href={submission.repositoryUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
								>
									<GitBranch className="size-5 shrink-0" />

									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium">
											Source Code Repository
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{submission.repositoryUrl}
										</p>
									</div>

									<ExternalLink className="size-4 shrink-0 text-muted-foreground" />
								</a>
							)}

							{submission.liveDemoUrl && (
								<Link
									href={submission.liveDemoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
								>
									<ExternalLink className="size-5 shrink-0" />

									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium">Live Demo</p>
										<p className="truncate text-xs text-muted-foreground">
											{submission.liveDemoUrl}
										</p>
									</div>

									<ExternalLink className="size-4 shrink-0 text-muted-foreground" />
								</Link>
							)}

							{!submission.repositoryUrl && !submission.liveDemoUrl && (
								<p className="text-sm text-muted-foreground">
									No project links available.
								</p>
							)}
						</CardContent>
					</Card>

					{/* Screenshots */}
					<Card>
						<CardHeader>
							<SectionTitle icon={ImageIcon}>Project Screenshots</SectionTitle>
						</CardHeader>

						<CardContent>
							{screenshots.length > 0 ? (
								<div className="grid gap-4 sm:grid-cols-2">
									{screenshots.map((screenshot, index) => (
										<Link
											key={screenshot}
											href={screenshot}
											target="_blank"
											rel="noopener noreferrer"
											className="group relative block overflow-hidden rounded-lg border"
										>
											<div className="relative aspect-video">
												<Image
													src={screenshot}
													alt={`Project screenshot ${index + 1}`}
													fill
													unoptimized
													sizes="(max-width: 640px) 100vw, 50vw"
													className="object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											</div>
										</Link>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No screenshots uploaded.
								</p>
							)}
						</CardContent>
					</Card>

					{/* Reviews */}
					<Card>
						<CardHeader>
							<SectionTitle icon={FileText}>
								Reviews ({reviews.length})
							</SectionTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							{reviews.length > 0 ? (
								reviews.map((review, index) => {
									const reviewer = review.reviewer;

									return (
										<div
											key={review.id ?? index}
											className="space-y-3 rounded-lg border p-4"
										>
											<div className="flex flex-wrap items-center justify-between gap-2">
												<p className="text-sm font-medium">
													{reviewer?.name || "Reviewer"}
												</p>

												{review.decision && (
													<Badge variant="outline">
														{String(review.decision).replaceAll("_", " ")}
													</Badge>
												)}
											</div>

											<p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
												{review.feedback || "No feedback provided."}
											</p>

											<p className="text-xs text-muted-foreground">
												{formatDate(review.createdAt)}
											</p>
										</div>
									);
								})
							) : (
								<p className="text-sm text-muted-foreground">
									No reviews available yet.
								</p>
							)}
						</CardContent>
					</Card>

					{/* Status History */}
					<Card>
						<CardHeader>
							<SectionTitle icon={Clock3}>Status History</SectionTitle>
						</CardHeader>

						<CardContent>
							{statusHistory.length > 0 ? (
								<div className="space-y-5">
									{statusHistory.map((history, index) => (
										<div
											key={history.id ?? index}
											className="relative flex gap-3"
										>
											<div className="mt-1 size-2.5 shrink-0 rounded-full bg-primary" />

											<div className="min-w-0 flex-1 space-y-1">
												<p className="text-sm font-medium">
													{String(history.toStatus).replaceAll("_", " ")}
												</p>

												{history.note && (
													<p className="text-sm text-muted-foreground">
														{history.note}
													</p>
												)}

												<p className="text-xs text-muted-foreground">
													{formatDate(history.createdAt)}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No status history available.
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<aside className="space-y-6">
					{/* Owner */}
					<Card>
						<CardHeader>
							<SectionTitle icon={UserRound}>Project Owner</SectionTitle>
						</CardHeader>

						<CardContent>
							<div className="flex items-center gap-3">
								<Avatar className="size-12">
									<AvatarImage
										src={owner?.avatar ?? undefined}
										alt={owner?.name ?? "Project owner"}
									/>
									<AvatarFallback>{getInitials(owner?.name)}</AvatarFallback>
								</Avatar>

								<div className="min-w-0 space-y-1">
									<p className="truncate text-sm font-semibold">
										{owner?.name || "Unknown User"}
									</p>
									<p className="break-all text-xs text-muted-foreground">
										{owner?.email || "No email available"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Submission Information */}
					<Card>
						<CardHeader>
							<SectionTitle icon={CalendarDays}>
								Submission Information
							</SectionTitle>
						</CardHeader>

						<CardContent className="space-y-4">
							<div className="flex items-start gap-3">
								<CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
								<div className="min-w-0 space-y-1">
									<p className="text-sm font-medium">Created At</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(submission.createdAt)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
								<div className="min-w-0 space-y-1">
									<p className="text-sm font-medium">Last Updated</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(submission.updatedAt)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
								<div className="min-w-0 space-y-1">
									<p className="text-sm font-medium">Submitted At</p>
									<p className="text-sm text-muted-foreground">
										{formatDate(submission.submittedAt)}
									</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-center justify-between gap-3">
								<span className="text-sm text-muted-foreground">
									Total Assignments
								</span>
								<Badge variant="secondary">{assignments.length}</Badge>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
