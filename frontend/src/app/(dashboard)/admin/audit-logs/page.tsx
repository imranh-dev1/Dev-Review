"use client";

import { ScrollText } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import DataPagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetAuditLogs } from "@/hooks/audit.hook";
import type { AuditAction, AuditEntityType, AuditLog } from "@/types";

const actions: AuditAction[] = [
	"CREATE",
	"UPDATE",
	"DELETE",
	"STATUS_CHANGE",
	"USER_STATUS_CHANGE",
	"ROLE_CHANGE",
	"ASSIGN_REVIEWER",
	"START_REVIEW",
	"SUBMIT_REVIEW",
	"LOGIN",
	"LOGOUT",
];

const entityTypes: AuditEntityType[] = [
	"USER",
	"SUBMISSION",
	"REVIEW",
	"ASSIGNMENT",
	"NOTIFICATION",
	"SYSTEM",
];

function formatLabel(value: string) {
	return value
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function AdminAuditLogsPage() {
	const [page, setPage] = useState(1);
	const [action, setAction] = useState<AuditAction | "">("");
	const [entityType, setEntityType] = useState<AuditEntityType | "">("");
	const limit = 20;

	const { data, isPending, isError } = useGetAuditLogs({
		page,
		limit,
		...(action ? { action } : {}),
		...(entityType ? { entityType } : {}),
	});

	const logs: AuditLog[] = data?.data ?? [];
	const meta = data?.meta;

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="System"
				title="Activity log"
				description="An immutable record of important actions taken across the platform."
			/>

			<div className="flex flex-wrap gap-2">
				<Select
					value={action || "ALL"}
					onValueChange={(value) => {
						setAction(value === "ALL" ? "" : (value as AuditAction));
						setPage(1);
					}}
				>
					<SelectTrigger className="w-56">
						<SelectValue placeholder="All actions" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All actions</SelectItem>
						{actions.map((item) => (
							<SelectItem key={item} value={item}>
								{formatLabel(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={entityType || "ALL"}
					onValueChange={(value) => {
						setEntityType(value === "ALL" ? "" : (value as AuditEntityType));
						setPage(1);
					}}
				>
					<SelectTrigger className="w-52">
						<SelectValue placeholder="All entities" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All entities</SelectItem>
						{entityTypes.map((item) => (
							<SelectItem key={item} value={item}>
								{formatLabel(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="overflow-hidden border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Action</TableHead>
							<TableHead>Entity</TableHead>
							<TableHead>Actor</TableHead>
							<TableHead>Details</TableHead>
							<TableHead>When</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isPending ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									Loading activity...
								</TableCell>
							</TableRow>
						) : isError ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center text-destructive"
								>
									Failed to load activity.
								</TableCell>
							</TableRow>
						) : logs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<ScrollText className="size-6" />
										No activity found.
									</div>
								</TableCell>
							</TableRow>
						) : (
							logs.map((log) => (
								<TableRow key={log.id}>
									<TableCell>
										<Badge variant="outline">{formatLabel(log.action)}</Badge>
									</TableCell>
									<TableCell>{formatLabel(log.entityType)}</TableCell>
									<TableCell>
										<div className="space-y-0.5">
											<p className="text-sm font-medium">
												{log.actor?.name ?? "System"}
											</p>
											<p className="text-xs text-muted-foreground">
												{log.actor?.email ?? "—"}
											</p>
										</div>
									</TableCell>
									<TableCell className="max-w-[320px]">
										<code className="line-clamp-2 break-all text-xs text-muted-foreground">
											{log.metadata ?? "—"}
										</code>
									</TableCell>
									<TableCell className="whitespace-nowrap text-sm text-muted-foreground">
										{new Date(log.createdAt).toLocaleString(undefined, {
											dateStyle: "medium",
											timeStyle: "short",
										})}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{!isError ? (
				<DataPagination
					content="activity entries"
					page={meta?.page ?? page}
					totalPages={meta?.totalPages ?? 0}
					total={meta?.total ?? 0}
					limit={meta?.limit ?? limit}
					isPending={isPending}
					onPageChange={setPage}
				/>
			) : null}
		</div>
	);
}
