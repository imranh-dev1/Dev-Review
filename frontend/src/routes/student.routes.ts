import {
	Bell,
	FileText,
	FolderKanban,
	LayoutDashboard,
	MessageSquareText,
	Settings,
	UserRound,
} from "lucide-react";
import type { SidebarGroup } from "@/types/sidebar.type";

export const studentRoutes: SidebarGroup[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/student",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "My Projects",
		items: [
			{
				title: "My Submissions",
				url: "/student/submissions",
				icon: FolderKanban,
			},
			{
				title: "Submit a Project",
				url: "/student/submissions/new",
				icon: FileText,
			},
			{
				title: "Review Feedback",
				url: "/student/feedback",
				icon: MessageSquareText,
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				title: "Notifications",
				url: "/student/notifications",
				icon: Bell,
			},
			{
				title: "My Profile",
				url: "/student/profile",
				icon: UserRound,
			},
			{
				title: "Settings",
				url: "/student/settings",
				icon: Settings,
			},
		],
	},
];
