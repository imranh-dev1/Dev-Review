"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, MessageSquareCode } from "lucide-react";

const footerLinks = {
	Platform: [
		{ label: "Home", href: "/" },
		{ label: "How it works", href: "/#how-it-works" },
		{ label: "Sign in", href: "/login" },
	],
	Resources: [
		{ label: "Create account", href: "/signup" },
		{ label: "Verify email", href: "/verify-email" },
	],
	Legal: [
		{ label: "Privacy policy", href: "/privacy" },
		{ label: "Terms of service", href: "/terms" },
	],
};

export function Footer() {
	const [year, setYear] = useState(2026);
	useEffect(() => {
		setYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
					<div className="lg:col-span-2">
						<Link href="/" className="inline-flex items-center gap-2">
							<div className="flex size-8 items-center justify-center border border-primary/40 bg-primary/10 text-primary"><MessageSquareCode className="size-4" /></div>
							<span className="text-sm font-semibold tracking-tight">Dev<span className="text-primary">Review</span></span>
						</Link>
						<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Structured project submissions, rubric-based reviews, and a traceable workflow from draft to decision.</p>
						<div className="mt-5"><Link href="mailto:support@devreview.app" className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"><Mail className="size-4" /></Link></div>
					</div>
					{Object.entries(footerLinks).map(([title, links]) => (
						<div key={title}>
							<h3 className="eyebrow">{title}</h3>
							<ul className="mt-3 space-y-2">
								{links.map((link) => (
									<li key={link.label}><Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">{link.label}<ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100" /></Link></li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="flex flex-col gap-2 border-t border-border py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>© {year} DevReview. All rights reserved.</p>
					<p>Built for structured, fair project reviews.</p>
				</div>
			</div>
		</footer>
	);
}
