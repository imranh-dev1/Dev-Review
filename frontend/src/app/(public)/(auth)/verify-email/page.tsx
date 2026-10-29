import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { VerifyEmailForm } from "@/components/forms/verify-email-form";

export const metadata = {
	title: "Verify email",
	description:
		"Enter the OTP sent to your email to verify your DevReview account.",
};

function VerifyEmailFallback() {
	return (
		<div className="w-full max-w-sm">
			<div className="mb-6 flex flex-col items-center gap-2 text-center">
				<Link href="/" className="mb-2 flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight">
						Dev<span className="text-primary">Review</span>
					</span>
				</Link>
				<h1 className="text-xl font-semibold tracking-tight">
					Verify your email
				</h1>
				<p className="text-sm text-muted-foreground">
					Loading verification form...
				</p>
			</div>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
			<div className="w-full max-w-sm">
				<div className="mb-6 flex flex-col items-center gap-2 text-center">
					<Link href="/" className="mb-2 flex items-center gap-2">
						<span className="text-sm font-semibold tracking-tight">
							Dev<span className="text-primary">Review</span>
						</span>
					</Link>
					<h1 className="text-xl font-semibold tracking-tight">
						Verify your email
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter the 6-digit code we sent to your email
					</p>
				</div>
				<Suspense fallback={<VerifyEmailFallback />}>
					<VerifyEmailForm />
				</Suspense>
				<div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
					<Link
						href="/login"
						className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
					>
						<ArrowLeft className="size-3" />
						Back to sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
