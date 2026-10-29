"use client";

import {
	Activity,
	ChartNoAxesCombined,
	ClipboardCheck,
	FolderKanban,
	Users,
} from "lucide-react";
import Link from "next/link";

import StatusBreakdown from "@/components/dashboard/analytics/status-breakdown";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/hooks/analytics.hook";
import type { AuditLog } from "@/types";

function formatAction(action: string) {
	return action
		?.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function AdminDashboardPage() {
	const { data, isPending } = useAdminAnalytics();
	const analytics = data?.data;
	const recentActivity: AuditLog[] = analytics?.recentActivity ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Administrator overview"
				title="Platform dashboard"
				description="Monitor growth, review throughput, and recent platform activity."
				actions={
					<Button asChild>
						<Link href="/admin/analytics">
							<ChartNoAxesCombined className="mr-2 size-4" />
							Full analytics
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Total users"
					value={analytics?.users?.total ?? 0}
					icon={Users}
					isLoading={isPending}
				/>
				<StatCard
					label="Submissions"
					value={analytics?.submissions?.total ?? 0}
					icon={FolderKanban}
					isLoading={isPending}
				/>
				<StatCard
					label="Reviews"
					value={analytics?.reviews?.total ?? 0}
					icon={ClipboardCheck}
					isLoading={isPending}
				/>
				<StatCard
					label="Approval rate"
					value={
						analytics?.approvalRate !== null &&
						analytics?.approvalRate !== undefined
							? `${analytics.approvalRate}%`
							: "No data"
					}
					hint={`${analytics?.assignments?.active ?? 0} active assignments`}
					icon={Activity}
					isLoading={isPending}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Submissions by status</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.submissions?.byStatus ?? []}
							isLoading={isPending}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Users by role</CardTitle>
					</CardHeader>
					<CardContent>
						<StatusBreakdown
							data={analytics?.users?.byRole ?? []}
							isLoading={isPending}
						/>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-base">Recent activity</CardTitle>
					<Button asChild variant="ghost" size="sm">
						<Link href="/admin/audit-logs">View all</Link>
					</Button>
				</CardHeader>
				<CardContent>
					{isPending ? (
						<div className="divide-y">
							{["first", "second", "third", "fourth"].map((rowKey) => (
								<div
									key={rowKey}
									className="flex flex-wrap items-center justify-between gap-2 py-2.5"
								>
									<div className="min-w-0 space-y-1.5">
										<Skeleton className="h-4 w-40" />
										<Skeleton className="h-3 w-56 max-w-full" />
									</div>
									<Skeleton className="h-3 w-32" />
								</div>
							))}
						</div>
					) : recentActivity.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No recorded activity yet.
						</p>
					) : (
						<div className="divide-y">
							{recentActivity.map((log) => (
								<div
									key={log.id}
									className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm"
								>
									<div className="min-w-0">
										<p className="font-medium">{formatAction(log.action)}</p>
										<p className="text-xs text-muted-foreground">
											{log.actor?.name ?? "System"} · {log.entityType}
										</p>
									</div>
									<span className="text-xs text-muted-foreground">
										{new Date(log.createdAt)?.toLocaleString(undefined, {
											dateStyle: "medium",
											timeStyle: "short",
										})}
									</span>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
