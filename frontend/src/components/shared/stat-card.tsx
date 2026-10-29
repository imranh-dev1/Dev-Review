import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
	label,
	value,
	hint,
	icon: Icon,
	trend,
	isLoading = false,
	className,
}: {
	label: string;
	value: string | number;
	hint?: string;
	icon?: LucideIcon;
	trend?: { value: string; direction: "up" | "down" | "flat" };
	isLoading?: boolean;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"group flex flex-col justify-between gap-4 border border-border bg-card p-4 transition-colors hover:border-foreground/20",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<p className="eyebrow">{label}</p>
				{Icon ? (
					<Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
				) : null}
			</div>

			{isLoading ? (
				<div className="space-y-2">
					<Skeleton className="h-7 w-20" />
					{hint ? <Skeleton className="h-3 w-28" /> : null}
				</div>
			) : (
				<>
					<div className="flex items-baseline gap-2">
						<span className="tnum text-2xl font-semibold tracking-tight text-foreground">
							{value}
						</span>
						{trend ? (
							<span
								className={cn(
									"tnum text-xs font-medium",
									trend.direction === "up" && "text-success",
									trend.direction === "down" && "text-destructive",
									trend.direction === "flat" && "text-muted-foreground",
								)}
							>
								{trend.value}
							</span>
						) : null}
					</div>

					{hint ? (
						<p className="text-xs leading-relaxed text-muted-foreground">
							{hint}
						</p>
					) : null}
				</>
			)}
		</div>
	);
}
