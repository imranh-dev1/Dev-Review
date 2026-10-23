import Profile from "@/components/dashboard/profile/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Profile | DevReview",
	description:
		"View and manage your DevReview profile information and account details.",
};

export default function ProfilePage() {
	return (
		<main className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
			<Profile />
		</main>
	);
}
