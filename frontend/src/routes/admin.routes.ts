
import { SidebarGroup } from "@/types/sidebar.type";
import {
	LayoutDashboard,
	FolderKanban,
	ClipboardCheck,
	Users,
	UserRound,
	Bell,
	Settings,
	History,
	ChartNoAxesCombined,
	UserCog,
} from "lucide-react";


export const adminRoutes: SidebarGroup[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
			},
			{
				title: "Analytics",
				url: "/dashboard/analytics",
				icon: ChartNoAxesCombined,
			},
		],
	},
	{
		title: "Management",
		items: [
			{
				title: "Users",
				url: "/dashboard/users",
				icon: Users,
			},
			{
				title: "Submissions",
				url: "/dashboard/submissions",
				icon: FolderKanban,
			},
			{
				title: "Reviews",
				url: "/dashboard/reviews",
				icon: ClipboardCheck,
			},
			{
				title: "Review Assignments",
				url: "/dashboard/assignments",
				icon: UserCog,
			},
		],
	},
	{
		title: "System",
		items: [
			{
				title: "Notifications",
				url: "/dashboard/notifications",
				icon: Bell,
			},
			{
				title: "Audit Logs",
				url: "/dashboard/audit-logs",
				icon: History,
			},
			{
				title: "Settings",
				url: "/dashboard/settings",
				icon: Settings,
			},
			{
				title: "My Profile",
				url: "/dashboard/profile",
				icon: UserRound,
			},
		],
	},
];
