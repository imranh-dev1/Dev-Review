
import { SidebarGroup } from "@/types/sidebar.type";
import {
	LayoutDashboard,
	FolderKanban,
	UserRound,
	Bell,
	Settings,
	FileText,
	MessageSquareText,
} from "lucide-react";

export const studentRoutes: SidebarGroup[] = [
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
		title: "My Projects",
		items: [
			{
				title: "My Submissions",
				url: "/dashboard/submissions",
				icon: FolderKanban,
			},
			{
				title: "Submit a Project",
				url: "/dashboard/submissions/new",
				icon: FileText,
			},
			{
				title: "Review Feedback",
				url: "/dashboard/feedback",
				icon: MessageSquareText,
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
