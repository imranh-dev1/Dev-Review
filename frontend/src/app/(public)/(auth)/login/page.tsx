import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";

export const metadata = {
	title: "Sign in",
	description: "Sign in to DevReview to submit projects and review work.",
};

export default function LoginPage() {
	return (
		<div className="relative flex min-h-[calc(100svh-10rem)] flex-col items-center justify-center px-4 py-12 sm:px-6">
			<div className="w-full max-w-sm">
				<div className="mb-6 flex flex-col items-center gap-2 text-center">
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
							className="underline-offset-4 hover:underline text-primary"
						>
							Create one
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}
