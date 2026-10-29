"use client";

import { CheckCircle2, Clock3, FileCode2, Plus, Star } from "lucide-react";
import Link from "next/link";

import StatusBreakdown from "@/components/dashboard/analytics/status-breakdown";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentAnalytics } from "@/hooks/analytics.hook";

export default function StudentDashboardPage() {
	const { data, isPending } = useStudentAnalytics();
	const analytics = data?.data;

	const byStatus = analytics?.submissions?.byStatus ?? [];
	const approved =
		byStatus.find((item: { status: string }) => item.status === "APPROVED")
			?.count ?? 0;
	const inReview =
		byStatus.find((item: { status: string }) => item.status === "IN_REVIEW")
			?.count ?? 0;

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Student overview"
				title="Your project dashboard"
				description="Track submissions, review progress, and feedback in one place."
				actions={
					<Button asChild>
						<Link href="/student/submissions/new">
							<Plus className="mr-2 size-4" />
							New submission
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Submissions"
					value={analytics?.submissions?.total ?? 0}
					icon={FileCode2}
					isLoading={isPending}
				/>
				<StatCard
					label="In review"
					value={inReview}
					icon={Clock3}
					isLoading={isPending}
				/>
				<StatCard
					label="Approved"
					value={approved}
					icon={CheckCircle2}
					isLoading={isPending}
				/>
				<StatCard
					label="Average score"
					value={
						analytics?.reviewsReceived?.avgScore !== null &&
						analytics?.reviewsReceived?.avgScore !== undefined
							? `${analytics.reviewsReceived.avgScore}/10`
							: "No reviews"
					}
					hint={`${analytics?.reviewsReceived?.count ?? 0} reviews received`}
					icon={Star}
					isLoading={isPending}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Submission status</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={byStatus}
							isLoading={isPending}
							emptyMessage="Submit your first project to see status insights."
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Quick actions</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2">
						<Button asChild variant="outline" className="justify-start">
							<Link href="/student/submissions/my-submissions">
								<FileCode2 className="mr-2 size-4" />
								View my submissions
							</Link>
						</Button>
						<Button asChild variant="outline" className="justify-start">
							<Link href="/student/feedback">
								<Star className="mr-2 size-4" />
								Review feedback
							</Link>
						</Button>
						<Button asChild variant="outline" className="justify-start">
							<Link href="/student/notifications">
								<Clock3 className="mr-2 size-4" />
								Notifications
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
