"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, reviewerRoutes, studentRoutes } from "@/routes";
import type { UserRole } from "@/types";
import type { SidebarRoutes } from "@/types/sidebar.type";
import Logo from "../../../public/logo.png";

const sidebarRoutes: Partial<Record<UserRole, SidebarRoutes>> = {
	ADMIN: adminRoutes,
	STUDENT: studentRoutes,
	REVIEWER: reviewerRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
	const routes: SidebarRoutes = sidebarRoutes[role] || [];
	const pathnme = usePathname();

	return (
		<Sidebar>
			<SidebarHeader>
				<Link
					href="/"
					aria-label="Dev Review home"
					className="flex shrink-0 items-center gap-2.5 ps-2 lg:ps-4"
				>
					<Image
						src={Logo}
						alt="Dev Review"
						width={100}
						height={50}
						className="h-7 w-auto object-contain lg:h-15"
						priority
					/>
				</Link>
			</SidebarHeader>
			<SidebarContent>
  {routes.map((group) => (
    <SidebarGroup key={group.title}>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={pathnme === item.url}
                  asChild
                >
                  <Link href={item.url}>
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))}
</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
