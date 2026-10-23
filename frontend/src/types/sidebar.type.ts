import { LucideIcon } from "lucide-react";

export type SidebarItem = {
	title: string;
	url: string;
	icon: LucideIcon;
};

export type SidebarGroup = {
	title: string;
	items: SidebarItem[];
};

export type SidebarRoutes = SidebarGroup[];
