"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
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
				<header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-1 hidden h-4 sm:block"
					/>

					<div className="hidden min-w-0 flex-col sm:flex">
						<p className="truncate text-xs font-medium">
							{user?.data?.name ?? "Workspace"}
						</p>
						<p className="truncate text-[11px] text-muted-foreground">
							{userRole.charAt(0) + userRole.slice(1).toLowerCase()} workspace
						</p>
					</div>

					<div className="ml-auto flex items-center gap-1.5">
						<ThemeToggle />
						{user?.data ? <NavUserDropdown user={user.data} /> : null}
					</div>
				</header>

				<div className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
