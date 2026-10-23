import {
	Bell,
	ClipboardCheck,
	FolderKanban,
	History,
	LayoutDashboard,
	Settings,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import type { SidebarGroup } from "@/types/sidebar.type";

export const reviewerRoutes: SidebarGroup[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "Review Workspace",
		items: [
			{
				title: "Assigned Projects",
				url: "/dashboard/assignments",
				icon: FolderKanban,
			},
			{
				title: "Pending Reviews",
				url: "/dashboard/reviews/pending",
				icon: ClipboardCheck,
			},
			{
				title: "Completed Reviews",
				url: "/dashboard/reviews/completed",
				icon: ShieldCheck,
			},
			{
				title: "Review History",
				url: "/dashboard/reviews/history",
				icon: History,
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				title: "Notifications",
				url: "/dashboard/notifications",
				icon: Bell,
			},
			{
				title: "My Profile",
				url: "/dashboard/profile",
				icon: UserRound,
			},
			{
				title: "Settings",
				url: "/dashboard/settings",
				icon: Settings,
			},
		],
	},
];
