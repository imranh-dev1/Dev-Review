import { cn } from "cn";
import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
	label = "Loading",
	className,
}: {
	label?: string;
	className?: string;
}) {
	return (
		<div
			role="status"
			aria-live="polite"
			className={cn(
				"flex min-h-40 flex-col items-center justify-center gap-3 text-muted-foreground",
				className,
			)}
		>
			<Loader2 className="size-4 animate-spin" />
			<p className="text-xs">{label}</p>
		</div>
	);
}

export function ErrorState({
	title = "Something went wrong",
	message,
	onRetry,
	className,
}: {
	title?: string;
	message?: string;
	onRetry?: () => void;
	className?: string;
}) {
	return (
		<div
			role="alert"
			className={cn(
				"flex min-h-40 flex-col items-center justify-center gap-3 border border-destructive/25 bg-destructive/5 p-6 text-center",
				className,
			)}
		>
			<AlertTriangle className="size-5 text-destructive" />
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium text-foreground">{title}</p>
				{message ? (
					<p className="max-w-md text-xs leading-relaxed text-muted-foreground">
						{message}
					</p>
				) : null}
			</div>
			{onRetry ? (
				<Button variant="outline" size="sm" onClick={onRetry}>
					<RefreshCw />
					Try again
				</Button>
			) : null}
		</div>
	);
}

export function EmptyState({
	title,
	description,
	icon: Icon = Inbox,
	action,
	className,
}: {
	title: string;
	description?: string;
	icon?: typeof Inbox;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-border bg-card/40 p-8 text-center",
				className,
			)}
		>
			<div className="flex size-9 items-center justify-center border border-border bg-background">
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium text-foreground">{title}</p>
				{description ? (
					<p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>
			{action}
		</div>
	);
}

export function ListSkeleton({
	items = 3,
	className,
}: {
	items?: number;
	className?: string;
}) {
	return (
		<div className={cn("grid gap-3", className)}>
			{Array.from({ length: items }, (_, index) => `item-${index}`).map(
				(itemKey) => (
					<div key={itemKey} className="border border-border bg-card p-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex-1 space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<Skeleton className="h-4 w-44 max-w-full" />
									<Skeleton className="h-5 w-20" />
								</div>
								<Skeleton className="h-3 w-3/4 max-w-full" />
								<Skeleton className="h-3 w-1/2 max-w-full" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-16" />
							</div>
						</div>
					</div>
				),
			)}
		</div>
	);
}

export function DetailSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("space-y-6", className)}>
			<div className="space-y-2">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-8 w-80 max-w-full" />
				<Skeleton className="h-4 w-60 max-w-full" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
				<div className="space-y-6">
					{["overview", "details"].map((cardKey) => (
						<div
							key={cardKey}
							className="space-y-4 border border-border bg-card p-5"
						>
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-5/6" />
							<Skeleton className="h-3 w-2/3" />
						</div>
					))}
				</div>

				<div className="space-y-6">
					{["meta", "status", "owner"].map((cardKey) => (
						<div
							key={cardKey}
							className="space-y-3 border border-border bg-card p-5"
						>
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function ProfileSkeleton() {
	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-8 w-44" />
				<Skeleton className="h-4 w-80 max-w-full" />
			</div>

			<div className="overflow-hidden border border-border bg-card">
				<Skeleton className="h-40 w-full" />
				<div className="relative -mt-12 flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
					<Skeleton className="size-24 border-4 border-background sm:size-28" />
					<div className="space-y-2 sm:pb-1">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-60 max-w-full" />
						<Skeleton className="h-5 w-40" />
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
				<div className="space-y-4 border border-border bg-card p-5">
					<Skeleton className="h-4 w-40" />
					<div className="grid gap-4 sm:grid-cols-2">
						{["name", "email", "role", "status"].map((fieldKey) => (
							<Skeleton key={fieldKey} className="h-20 w-full" />
						))}
					</div>
				</div>
				<div className="space-y-4 border border-border bg-card p-5">
					<Skeleton className="h-4 w-36" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		</div>
	);
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
	return (
		<div className="space-y-5 border border-border bg-card p-6">
			{Array.from({ length: fields }, (_, index) => `field-${index}`).map(
				(fieldKey) => (
					<div key={fieldKey} className="space-y-2">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-9 w-full" />
					</div>
				),
			)}
			<div className="flex gap-2">
				<Skeleton className="h-9 w-28" />
				<Skeleton className="h-9 w-24" />
			</div>
		</div>
	);
}

export function TableSkeleton({
	rows = 6,
	columns = 5,
}: {
	rows?: number;
	columns?: number;
}) {
	return (
		<div className="flex flex-col gap-px overflow-hidden border border-border">
			{Array.from({ length: rows }, (_, rowIndex) => `row-${rowIndex}`).map(
				(rowKey) => (
					<div
						key={rowKey}
						className="flex items-center gap-4 border-b border-border px-3 py-3 last:border-b-0"
					>
						{Array.from(
							{ length: columns },
							(_, columnIndex) => `col-${columnIndex}`,
						).map((columnKey, columnIndex) => (
							<Skeleton
								key={columnKey}
								className={cn("h-3", columnIndex === 0 ? "w-1/3" : "w-1/6")}
							/>
						))}
					</div>
				),
			)}
		</div>
	);
}

export function CardSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("border border-border bg-card p-4", className)}>
			<Skeleton className="h-3 w-24" />
			<Skeleton className="mt-4 h-7 w-16" />
			<Skeleton className="mt-3 h-3 w-full" />
		</div>
	);
}
