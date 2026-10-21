"use client";

import Link from "next/link";
import { ArrowRight, FileText, Plus, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/shared/state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { formatRelative } from "@/lib/format";
import { SUBMISSION_STATUS_META } from "@/lib/status";
import type { MyAnalytics, PlatformAnalytics, ReviewerAnalytics, Submission } from "@/types";

export default function DashboardPage() {
	const { user } = useAuth();
	if (user?.role === "ADMIN") return <AdminDashboard />;
	if (user?.role === "REVIEWER") return <ReviewerDashboard />;
	return <StudentDashboard />;
}

function StudentDashboard() {
	const { data: analytics } = useApi<MyAnalytics>("/analytics/me");
	const { data: submissions, isLoading } = useApi<Submission[]>("/submissions/mine", { query: { limit: 5 } });
	const byStatus = analytics?.submissions.byStatus ?? [];
	const statusMap = Object.fromEntries(byStatus.map((item) => [item.status, item.count]));

	return (
		<div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
			<PageHeader eyebrow="Student" title="Your submissions" description="Track reviews, respond to feedback, and resubmit when changes are requested." actions={<Button asChild size="sm"><Link href="/submissions/new"><Plus />New submission</Link></Button>} />
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Total submissions" value={analytics?.submissions.total ?? "—"} icon={FileText} />
				<StatCard label="Pending / in review" value={(statusMap.SUBMITTED ?? 0) + (statusMap.IN_REVIEW ?? 0) + (statusMap.RESUBMITTED ?? 0)} icon={ShieldCheck} />
				<StatCard label="Changes requested" value={statusMap.CHANGES_REQUESTED ?? "—"} icon={ArrowRight} />
				<StatCard label="Approved" value={statusMap.APPROVED ?? "—"} icon={FileText} />
			</div>
			<Card className="border-border">
				<CardHeader className="flex flex-row items-center justify-between gap-2">
					<div>
						<p className="text-sm font-semibold">Recent submissions</p>
						<p className="text-xs text-muted-foreground">Your latest project submissions</p>
					</div>
					<Button asChild variant="ghost" size="sm"><Link href="/submissions">View all<ArrowRight /></Link></Button>
				</CardHeader>
				<CardContent className="flex flex-col divide-y divide-border">
					{isLoading ? <LoadingState label="Loading submissions" className="min-h-32" /> : submissions && submissions.length > 0 ? (
						submissions.map((submission) => {
							const meta = SUBMISSION_STATUS_META[submission.status];
							return (
								<Link key={submission.id} href={`/submissions/${submission.id}`} className="flex flex-col gap-2 py-3 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex min-w-0 flex-col gap-1">
										<p className="truncate text-sm font-medium">{submission.title}</p>
										<p className="truncate text-xs text-muted-foreground">{submission.summary}</p>
									</div>
									<div className="flex items-center gap-2">
										<StatusBadge label={meta.label} tone={meta.tone} />
										<span className="text-xs text-muted-foreground">{formatRelative(submission.updatedAt)}</span>
									</div>
								</Link>
							);
						})
					) : (
						<EmptyState title="No submissions yet" description="Create your first submission to start the review process." action={<Button asChild size="sm"><Link href="/submissions/new"><Plus />New submission</Link></Button>} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function ReviewerDashboard() {
	const { data: analytics } = useApi<ReviewerAnalytics>("/analytics/reviewer");
	return (
		<div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
			<PageHeader eyebrow="Reviewer" title="Review workspace" description="Triage your queue, evaluate submissions, and submit decisions with feedback." actions={<Button asChild size="sm"><Link href="/queue"><ShieldCheck />Open queue</Link></Button>} />
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Reviews submitted" value={analytics?.reviews.total ?? "—"} icon={FileText} />
				<StatCard label="Average score given" value={analytics?.reviews.averageScoreGiven?.toFixed(1) ?? "—"} icon={ShieldCheck} />
				<StatCard label="Pending assignments" value={analytics?.assignments.pending ?? "—"} icon={ArrowRight} />
			</div>
		</div>
	);
}

function AdminDashboard() {
	const { data: analytics } = useApi<PlatformAnalytics>("/analytics/platform");
	return (
		<div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
			<PageHeader eyebrow="Administrator" title="Platform overview" description="Monitor users, submissions, reviews, and activity across DevReview." actions={<Button asChild size="sm"><Link href="/analytics"><ShieldCheck />Detailed analytics</Link></Button>} />
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Total users" value={analytics?.users.total ?? "—"} icon={FileText} />
				<StatCard label="Total submissions" value={analytics?.submissions.total ?? "—"} icon={FileText} />
				<StatCard label="Total reviews" value={analytics?.reviews.total ?? "—"} icon={ShieldCheck} />
				<StatCard label="Active assignments" value={analytics?.assignments.active ?? "—"} icon={FileText} />
			</div>
		</div>
	);
}
