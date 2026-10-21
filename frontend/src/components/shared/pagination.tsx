import { cn } from "cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

export function Pagination({
	page,
	totalPages,
	total,
	limit,
	onPageChange,
	className,
}: {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onPageChange: (page: number) => void;
	className?: string;
}) {
	if (totalPages <= 1) return null;

	const start = (page - 1) * limit + 1;
	const end = Math.min(page * limit, total);

	const canPrevious = page > 1;
	const canNext = page < totalPages;

	return (
		<nav
			aria-label="Pagination"
			className={cn(
				"flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<p className="tnum text-xs text-muted-foreground">
				Showing <span className="text-foreground">{formatNumber(start)}</span>–
				<span className="text-foreground">{formatNumber(end)}</span> of{" "}
				<span className="text-foreground">{formatNumber(total)}</span>
			</p>

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					disabled={!canPrevious}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft />
					Previous
				</Button>
				<span className="tnum px-2 text-xs text-muted-foreground">
					Page {formatNumber(page)} / {formatNumber(totalPages)}
				</span>
				<Button
					variant="ghost"
					size="sm"
					disabled={!canNext}
					onClick={() => onPageChange(page + 1)}
				>
					Next
					<ChevronRight />
				</Button>
			</div>
		</nav>
	);
}
