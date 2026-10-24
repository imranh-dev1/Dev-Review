import type { Metadata } from "next";
import { ForgetPasswordOTPForm } from "@/components/forms/forgot-password-form-otp-verify";

export const metadata: Metadata = {
	title: "Verify OTP | DevReview",
	description:
		"Verify your password reset code and securely reset your DevReview account password.",
};

export default function ForgotPasswordOtpVerifyPage() {
	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
			<ForgetPasswordOTPForm />
		</main>
	);
}
