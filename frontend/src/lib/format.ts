import { format, formatDistanceToNowStrict } from "date-fns";

export function formatDate(value: string | null | undefined): string {
	if (!value) return "—";
	try {
		return format(new Date(value), "d MMM yyyy");
	} catch {
		return "—";
	}
}

export function formatDateTime(value: string | null | undefined): string {
	if (!value) return "—";
	try {
		return format(new Date(value), "d MMM yyyy, HH:mm");
	} catch {
		return "—";
	}
}

export function formatRelative(value: string | null | undefined): string {
	if (!value) return "—";
	try {
		return `${formatDistanceToNowStrict(new Date(value))} ago`;
	} catch {
		return "—";
	}
}

export function formatNumber(value: number | null | undefined): string {
	if (value === null || value === undefined || Number.isNaN(value)) return "—";
	return new Intl.NumberFormat("en-US").format(value);
}

export function formatScore(value: number | string | null | undefined): string {
	if (value === null || value === undefined) return "—";
	const numeric = typeof value === "string" ? Number(value) : value;
	if (Number.isNaN(numeric)) return "—";
	return numeric.toFixed(1);
}

export function initials(name: string | null | undefined): string {
	if (!name) return "?";
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export function truncate(value: string, length: number): string {
	if (value.length <= length) return value;
	return `${value.slice(0, length - 1).trimEnd()}…`;
}

export function hostFromUrl(url: string | null | undefined): string {
	if (!url) return "—";
	try {
		return new URL(url).host.replace(/^www\./, "");
	} catch {
		return url;
	}
}

export function titleCase(value: string): string {
	return value
		.toLowerCase()
		.split(/[\s_]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
