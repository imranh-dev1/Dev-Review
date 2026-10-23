import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Forgot Password | DevReview",
	description: "Reset your DevReview account password securely.",
};

export default function ForgotPasswordPage() {
	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
			<ForgotPasswordForm />
		</main>
	);
}
