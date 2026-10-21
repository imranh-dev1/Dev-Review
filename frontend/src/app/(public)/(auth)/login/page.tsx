import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
	title: "Sign in",
	description: "Sign in to DevReview to submit projects and review work.",
};

export default function LoginPage() {
	return (
		<div className="relative flex min-h-[calc(100svh-10rem)] flex-col items-center justify-center px-4 py-12 sm:px-6">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-60"
			/>

			<div className="w-full max-w-sm">
				<div className="mb-6 flex flex-col items-center gap-2 text-center">
					<Link href="/" className="mb-2 flex items-center gap-2">
						<span className="text-sm font-semibold tracking-tight">
							Dev<span className="text-primary">Review</span>
						</span>
					</Link>
					<h1 className="text-xl font-semibold tracking-tight">
						Sign in to your account
					</h1>
					<p className="text-sm text-muted-foreground">
						Access your dashboard, submissions, and review queue
					</p>
				</div>

				<LoginForm />

				<div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
					<Link
						href="/"
						className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
					>
						<ArrowLeft className="size-3" />
						Back to home
					</Link>
					<span>
						Need an account?{" "}
						<Link
							href="/signup"
							className="text-foreground underline-offset-4 hover:underline"
						>
							Create one
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}
