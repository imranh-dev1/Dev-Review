import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot Password | DevReview",
	description: "Reset your DevReview account password securely.",
};

export default function ForgotPasswordPage() {
	return (
		<main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
			<Suspense fallback={<AuthLoading />}>
				<ForgotPasswordForm />
			</Suspense>
		</main>
	);
}
