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
