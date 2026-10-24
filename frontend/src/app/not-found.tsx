"use client";
import { ArrowLeft, ArrowRight, Compass, Home, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
			{/* Background decoration */}

			<div className="relative mx-auto w-full max-w-xl text-center">
				{/* Error illustration */}
				<div className="relative mx-auto mb-8 flex size-28 items-center justify-center rounded-3xl border bg-card shadow-sm">
					<div className="absolute inset-3 rounded-2xl bg-primary/5" />
					<Compass className="relative size-12 text-primary" />
					<span className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full border bg-background text-sm font-semibold">
						!
					</span>
				</div>

				<p className="mb-3 text-sm font-semibold tracking-[0.25em] text-primary uppercase">
					Error 404
				</p>

				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Page not found
				</h1>

				<p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
					Oops! The page you&apos;re looking for doesn&apos;t exist, may have
					been moved, or the link might be incorrect.
				</p>

				<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
					<Button asChild size="lg" className="gap-2">
						<Link href="/">
							<Home className="size-4" />
							Back to home
							<ArrowRight className="size-4" />
						</Link>
					</Button>

					<Button
						type="button"
						variant="outline"
						size="lg"
						className="gap-2"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="size-4" />
						Go back
					</Button>
				</div>

				<div className="mx-auto mt-12 max-w-sm border-t pt-6">
					<p className="text-sm text-muted-foreground">
						Need help finding something?
					</p>
					<Link
						href="/"
						className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
					>
						<Search className="size-4" />
						Explore DevReview
					</Link>
				</div>

				<p className="mt-10 text-xs text-muted-foreground">
					DevReview · Project Submission & Review Platform
				</p>
			</div>
		</main>
	);
}
