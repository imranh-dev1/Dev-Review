import { cn } from "cn";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
	value: string;
	label: string;
}

export function DataToolbar({
	searchValue,
	onSearchChange,
	searchPlaceholder = "Search…",
	children,
	className,
	onReset,
}: {
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder?: string;
	children?: React.ReactNode;
	className?: string;
	onReset?: () => void;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 border border-border bg-card p-2 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<div className="relative w-full sm:w-72">
					<Input
						value={searchValue}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder={searchPlaceholder}
						className="pl-2.5"
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">{children}</div>
			</div>
			{onReset ? (
				<Button
					variant="ghost"
					size="sm"
					onClick={onReset}
					className="hidden sm:inline-flex"
				>
					<Filter />
					Reset
				</Button>
			) : null}
		</div>
	);
}

export function FilterSelect({
	label,
	value,
	onChange,
	options,
	allLabel = "All",
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: FilterOption[];
	allLabel?: string;
}) {
	return (
		<Select
			value={value || "all"}
			onValueChange={(v) => onChange(v === "all" ? "" : v)}
		>
			<SelectTrigger className="w-full sm:w-44">
				<div className="flex items-center gap-1.5">
					<span className="text-muted-foreground">{label}:</span>
					<SelectValue placeholder={allLabel} />
				</div>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">{allLabel}</SelectItem>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
