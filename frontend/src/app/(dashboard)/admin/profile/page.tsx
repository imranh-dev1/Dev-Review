import type { Metadata } from "next";
import Profile from "@/components/dashboard/profile/profile";

export const metadata: Metadata = {
	title: "My Profile | DevReview",
	description:
		"View and manage your DevReview profile information and account details.",
};

export default function ProfilePage() {
	return (
		<div className="mx-auto w-full">
			<Profile />
		</div>
	);
}
