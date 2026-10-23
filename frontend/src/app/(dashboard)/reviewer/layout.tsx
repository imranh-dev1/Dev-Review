import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-gurd";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function ReviewerLayout({ children }: { children: ReactNode }) {
	return (
		<RoleGuard allowedRoles={["REVIEWER"]}>
			<DashboardShell userRole="REVIEWER">{children}</DashboardShell>
		</RoleGuard>
	);
}
