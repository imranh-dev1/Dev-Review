import {
	Bell,
	ClipboardCheck,
	Edit,
	FolderKanban,
	History,
	LayoutDashboard,
	LockKeyhole,
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
				url: "/reviewer",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "Review Workspace",
		items: [
			{
				title: "Assigned Projects",
				url: "/reviewer/assignments",
				icon: FolderKanban,
			},
			{
				title: "Pending Reviews",
				url: "/reviewer/reviews/pending",
				icon: ClipboardCheck,
			},
			{
				title: "Completed Reviews",
				url: "/reviewer/reviews/completed",
				icon: ShieldCheck,
			},
			{
				title: "Review History",
				url: "/reviewer/reviews/history",
				icon: History,
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				title: "Notifications",
				url: "/reviewer/notifications",
				icon: Bell,
			},
			{
				title: "My Profile",
				url: "/reviewer/profile",
				icon: UserRound,
			},
			{
				title: "Update My Profile",
				url: "/reviewer/update-my-profile",
				icon: Edit,
			},
			{
				title: "Change Password",
				url: "/reviewer/change-password",
				icon: LockKeyhole,
			},
		],
	},
];
