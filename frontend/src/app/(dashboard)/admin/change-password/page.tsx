import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/forms/change-password-form";

export const metadata: Metadata = {
	title: "Change Password | DevReview",
	description: "Secure your DevReview account by updating your password.",
};

export default function ChangePasswordPage() {
	return (
		<div className="mx-auto w-full max-w-2xl">
			<ChangePasswordForm />
		</div>
	);
}
