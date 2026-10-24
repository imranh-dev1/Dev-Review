import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/forms/change-password-form";

export const metadata: Metadata = {
	title: "Change Password | DevReview",
	description: "Secure your DevReview account by updating your password.",
};

export default function ChangePasswordPage() {
	return (
		<main className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-8">
			<ChangePasswordForm />
		</main>
	);
}
