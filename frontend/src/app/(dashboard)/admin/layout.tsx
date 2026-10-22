import RoleGuard from "@/components/auth/role-gurd";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <DashboardShell userRole="ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
}