import { cn } from "cn";
import type { ReactNode } from "react";

export function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	className,
}: {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<header
			className={cn(
				"flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between",
				className,
			)}
		>
			<div className="flex min-w-0 flex-col gap-1.5">
				{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
				<h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
					{title}
				</h1>
				{description ? (
					<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>

			{actions ? (
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					{actions}
				</div>
			) : null}
		</header>
	);
}

export function SectionHeading({
	title,
	description,
	actions,
	className,
}: {
	title: string;
	description?: string;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<div className="min-w-0">
				<h2 className="text-sm font-semibold tracking-tight text-foreground">
					{title}
				</h2>
				{description ? (
					<p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
				) : null}
			</div>
			{actions ? (
				<div className="flex shrink-0 items-center gap-2">{actions}</div>
			) : null}
		</div>
	);
}
