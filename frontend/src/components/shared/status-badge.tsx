import { cn } from "cn";

import type { StatusMeta } from "@/lib/status";

type Tone = StatusMeta["tone"];

const TONE_CLASSES: Record<Tone, string> = {
	neutral:
		"border-border bg-muted text-muted-foreground [&_svg]:text-muted-foreground",
	info: "border-info/30 bg-info/10 text-info [&_svg]:text-info",
	success:
		"border-success/30 bg-success/10 text-success [&_svg]:text-success",
	warning:
		"border-warning/30 bg-warning/10 text-warning [&_svg]:text-warning",
	danger:
		"border-destructive/30 bg-destructive/10 text-destructive [&_svg]:text-destructive",
};

const DOT_CLASSES: Record<Tone, string> = {
	neutral: "bg-muted-foreground",
	info: "bg-info",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-destructive",
};

export function StatusBadge({
	label,
	tone = "neutral",
	className,
	dot = true,
}: {
	label: string;
	tone?: Tone;
	className?: string;
	dot?: boolean;
}) {
	return (
		<span
			data-slot="status-badge"
			className={cn(
				"inline-flex h-5 shrink-0 items-center gap-1.5 whitespace-nowrap border px-2 text-[11px] font-medium leading-none",
				TONE_CLASSES[tone],
				className,
			)}
		>
			{dot ? (
				<span
					aria-hidden
					className={cn("size-1.5 shrink-0", DOT_CLASSES[tone])}
				/>
			) : null}
			{label}
		</span>
	);
}
