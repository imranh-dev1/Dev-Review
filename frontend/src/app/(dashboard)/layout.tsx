import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
	title: {
		default: "Dashboard",
		template: "%s | DevReview",
	},
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<AppShell>{children}</AppShell>
		</AuthGuard>
	);
}
