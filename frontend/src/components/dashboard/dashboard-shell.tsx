"use client";

import type { ReactNode } from "react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetMe } from "@/hooks";
import type { UserRole } from "@/types";
import { NavUserDropdown } from "../dropdown/nav-user-dropdown";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({
	children,
	userRole,
}: {
	children: ReactNode;
	userRole: UserRole;
}) {
	const { data: user } = useGetMe();

	return (
		<SidebarProvider>
			<DashboardSidebar role={userRole} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-10 justify-between ">
					<SidebarTrigger className="-ml-1 p-5" />

					<div className="">
						{user?.data && <NavUserDropdown user={user.data} />}
					</div>
				</header>
				<div className="p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
