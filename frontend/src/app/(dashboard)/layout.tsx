import type { Metadata } from "next";
import AuthGuard from "@/components/auth/auth-guard";
import { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: "%s | DevReview",
	},
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
