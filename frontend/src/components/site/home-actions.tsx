"use client";

import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks";
import { getPublicActions } from "@/lib/public-links";

type HomeActionsProps = {
	variant?: "hero" | "final";
};

export function HomeActions({ variant = "hero" }: HomeActionsProps) {
	const { data, isLoading } = useGetMe();
	const user = data?.data;
	const actions = getPublicActions(user?.role);

	if (isLoading) {
		return (
			<div className="flex flex-wrap items-center gap-2" aria-hidden>
				<div className="h-9 w-40 animate-pulse bg-muted" />
				<div className="h-9 w-28 animate-pulse bg-muted" />
			</div>
		);
	}

	if (!user) {
		return (
			<>
				<Button asChild size="lg">
					<Link href="/signup">
						Start submitting
						<ArrowRight />
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link href="/login">Sign in</Link>
				</Button>
				{variant === "hero" && (
					<Button asChild variant="ghost" size="lg">
						<Link href="#how-it-works">See how it works</Link>
					</Button>
				)}
			</>
		);
	}

	return (
		<>
			<Button asChild size="lg">
				<Link href={actions.submit.href}>
					{actions.submit.label}
					<ArrowRight />
				</Link>
			</Button>
			<Button asChild variant="outline" size="lg">
				<Link href={actions.queue.href}>{actions.queue.label}</Link>
			</Button>
			{variant === "hero" && (
				<Button asChild variant="ghost" size="lg">
					<Link href={actions.dashboard}>
						<LayoutDashboard />
						Dashboard
					</Link>
				</Button>
			)}
		</>
	);
}
