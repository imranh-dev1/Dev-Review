import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
	title: "Create account",
	description:
		"Create a DevReview account to submit projects or join as a reviewer.",
};

export default function SignupPage() {
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
						Create your account
					</h1>
					<p className="text-sm text-muted-foreground">
						Submit projects and get structured feedback
					</p>
				</div>

				<RegisterForm />

				<div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
					<Link
						href="/"
						className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
					>
						<ArrowLeft className="size-3" />
						Back to home
					</Link>
					<span>
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-foreground underline-offset-4 hover:underline"
						>
							Sign in
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}
