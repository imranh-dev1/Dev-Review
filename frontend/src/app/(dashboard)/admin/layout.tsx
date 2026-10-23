import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-gurd";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<RoleGuard allowedRoles={["ADMIN"]}>
			<DashboardShell userRole="ADMIN">{children}</DashboardShell>
		</RoleGuard>
	);
}
