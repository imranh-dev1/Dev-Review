import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLoading from "@/components/auth/auth-loading";
import { ForgetPasswordOTPForm } from "@/components/forms/forgot-password-form-otp-verify";

export const metadata: Metadata = {
	title: "Verify OTP | DevReview",
	description:
		"Verify your password reset code and securely reset your DevReview account password.",
};

export default function ForgotPasswordOtpVerifyPage() {
	return (
		<main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
			<Suspense fallback={<AuthLoading />}>
				<ForgetPasswordOTPForm />
			</Suspense>
		</main>
	);
}
