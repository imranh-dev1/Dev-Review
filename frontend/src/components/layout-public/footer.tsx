"use client";
import { ArrowUpRight, ExternalLink, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../public/logo.png";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const footerLinks = {
	Platform: [
		{ label: "Home", href: "/" },
		{ label: "How it works", href: "/#how-it-works" },
		{ label: "Sign in", href: "/login" },
	],
	Resources: [{ label: "Create account", href: "/signup" }],
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
		<footer className="border-t bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Main Footer */}
				<div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link
							href="/"
							aria-label="DevReview home"
							className="inline-flex transition-opacity hover:opacity-80"
						>
							<Image
								src={Logo}
								alt="DevReview"
								width={160}
								height={48}
								className="h-12 w-auto object-contain"
								priority
							/>
						</Link>

						<p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
							A structured platform for project submissions, rubric-based
							reviews, and transparent feedback from draft to final decision.
						</p>
					</div>

					{/* Navigation */}
					{Object.entries(footerLinks).map(([title, links]) => (
						<nav key={title} aria-label={title}>
							<h3 className="text-sm font-semibold tracking-tight">{title}</h3>

							<ul className="mt-4 space-y-3">
								{links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
											<ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				{/* Contact Cards */}
				<div className="grid gap-4 pb-8 sm:grid-cols-2">
					{/* Email */}
					<Card className="group transition-colors hover:border-primary/40 hover:cursor-pointer">
						<CardContent className="flex items-center gap-4 p-4">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
								<Mail className="size-5" />
							</div>

							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-muted-foreground">
									GET IN TOUCH
								</p>
								<p className="mt-1 truncate text-sm font-medium transition-colors group-hover:text-primary">
									imranh.dev1@gmail.com
								</p>
							</div>

							<Button asChild variant="ghost" size="icon" className="shrink-0">
								<a
									href="mailto:imranh.dev1@gmail.com"
									aria-label="Send an email"
								>
									<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
								</a>
							</Button>
						</CardContent>
					</Card>

					{/* Portfolio */}
					<Card className="group transition-colors hover:border-primary/40 hover:cursor-pointer">
						<CardContent className="flex items-center gap-4 p-4 ">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
								<ExternalLink className="size-5" />
							</div>

							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-muted-foreground">
									EXPLORE MY WORK
								</p>
								<p className="mt-1 text-sm font-medium transition-colors group-hover:text-primary">
									Personal Portfolio
								</p>
							</div>

							<Button asChild variant="outline" size="sm" className="shrink-0">
								<a
									href="https://imranh-dev-portfolio.vercel.app/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Visit
									<ArrowUpRight className="ml-1 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
								</a>
							</Button>
						</CardContent>
					</Card>
				</div>

				<Separator />

				{/* Footer Bottom */}
				<div className="flex flex-col gap-2 border-t border-border py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>© {year} DevReview. All rights reserved.</p>
					<p>Built for structured, fair project reviews.</p>
				</div>
			</div>
		</footer>
	);
}
