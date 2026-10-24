import type { Metadata } from "next";
import { UpdateProfileForm } from "@/components/dashboard/profile/update-profile-form";

export const metadata: Metadata = {
	title: "Update Profile | DevReview",
	description:
		"Update your DevReview profile information and keep your account details up to date.",
};

export default function UpdateMyProfilePage() {
	return (
		<main className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
			<UpdateProfileForm />
		</main>
	);
}
