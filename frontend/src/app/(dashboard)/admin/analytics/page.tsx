"use client";

import {
	Activity,
	Bell,
	ClipboardCheck,
	FolderKanban,
	Star,
	Users,
} from "lucide-react";

import StatusBreakdown from "@/components/dashboard/analytics/status-breakdown";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAnalytics } from "@/hooks/analytics.hook";

export default function AdminAnalyticsPage() {
	const { data, isLoading, isError } = useAdminAnalytics();
	const analytics = data?.data;

	if (isError) {
		return (
			<p className="border border-dashed p-10 text-center text-sm text-destructive">
				Failed to load analytics.
			</p>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Platform analytics"
				title="Analytics overview"
				description="Understand user distribution, submission flow, and review outcomes."
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard
					label="Users"
					value={analytics?.users?.total ?? 0}
					icon={Users}
					hint={`${analytics?.users?.byStatus?.find((item: { status: string }) => item.status === "ACTIVE")?.count ?? 0} active`}
					isLoading={isLoading}
				/>
				<StatCard
					label="Submissions"
					value={analytics?.submissions?.total ?? 0}
					icon={FolderKanban}
					isLoading={isLoading}
				/>
				<StatCard
					label="Reviews"
					value={analytics?.reviews?.total ?? 0}
					icon={ClipboardCheck}
					hint={
						analytics?.reviews?.averageScore !== null &&
						analytics?.reviews?.averageScore !== undefined
							? `Avg ${analytics.reviews.averageScore}/10`
							: "No reviews yet"
					}
					isLoading={isLoading}
				/>
				<StatCard
					label="Approval rate"
					value={
						analytics?.approvalRate !== null &&
						analytics?.approvalRate !== undefined
							? `${analytics.approvalRate}%`
							: "No data"
					}
					icon={Star}
					isLoading={isLoading}
				/>
				<StatCard
					label="Active assignments"
					value={analytics?.assignments?.active ?? 0}
					icon={Activity}
					isLoading={isLoading}
				/>
				<StatCard
					label="Notifications"
					value={analytics?.notifications?.total ?? 0}
					icon={Bell}
					isLoading={isLoading}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Users by role</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.users?.byRole ?? []}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Users by status</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.users?.byStatus ?? []}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Submissions by status</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.submissions?.byStatus ?? []}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
