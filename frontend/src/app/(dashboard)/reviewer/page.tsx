"use client";

import { ClipboardCheck, FolderKanban, Star, Timer } from "lucide-react";
import Link from "next/link";

import StatusBreakdown from "@/components/dashboard/analytics/status-breakdown";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewerAnalytics } from "@/hooks/analytics.hook";

export default function ReviewerDashboardPage() {
	const { data, isPending } = useReviewerAnalytics();
	const analytics = data?.data;

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Reviewer overview"
				title="Your review workspace"
				description="See what needs your attention and keep track of completed reviews."
				actions={
					<Button asChild>
						<Link href="/reviewer/assignments">
							<FolderKanban className="mr-2 size-4" />
							Open assignments
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Pending"
					value={analytics?.assignments?.pending ?? 0}
					icon={Timer}
					hint="Assignments awaiting action"
					isLoading={isPending}
				/>
				<StatCard
					label="Reviews completed"
					value={analytics?.reviews?.total ?? 0}
					icon={ClipboardCheck}
					isLoading={isPending}
				/>
				<StatCard
					label="Average score given"
					value={
						analytics?.reviews?.averageScoreGiven !== null &&
						analytics?.reviews?.averageScoreGiven !== undefined
							? `${analytics.reviews.averageScoreGiven}/10`
							: "No reviews"
					}
					icon={Star}
					isLoading={isPending}
				/>
				<StatCard
					label="Active assignments"
					value={(analytics?.assignments?.byStatus ?? [])
						.filter((item: { status: string }) =>
							["ASSIGNED", "ACCEPTED"].includes(item.status),
						)
						.reduce(
							(sum: number, item: { count: number }) => sum + item.count,
							0,
						)}
					icon={FolderKanban}
					isLoading={isPending}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Assignment status</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.assignments?.byStatus ?? []}
							isLoading={isPending}
							emptyMessage="No assignments yet."
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Workspace shortcuts</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2">
						<Button asChild variant="outline" className="justify-start">
							<Link href="/reviewer/reviews/pending">
								<Timer className="mr-2 size-4" />
								Pending reviews
							</Link>
						</Button>
						<Button asChild variant="outline" className="justify-start">
							<Link href="/reviewer/reviews/completed">
								<ClipboardCheck className="mr-2 size-4" />
								Completed reviews
							</Link>
						</Button>
						<Button asChild variant="outline" className="justify-start">
							<Link href="/reviewer/reviews/history">
								<Star className="mr-2 size-4" />
								Review history
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
