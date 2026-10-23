import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

export const instant = false;

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: "%s | DevReview",
	},
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return <AuthGuard>{children}</AuthGuard>;
}
