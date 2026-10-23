import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-gurd";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function StudentLayout({ children }: { children: ReactNode }) {
	return (
		<RoleGuard allowedRoles={["STUDENT"]}>
			<DashboardShell userRole="STUDENT">{children}</DashboardShell>
		</RoleGuard>
	);
}
