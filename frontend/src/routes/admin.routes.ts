import {
	Bell,
	ChartNoAxesCombined,
	ClipboardCheck,
	Edit,
	FileText,
	FolderKanban,
	LayoutDashboard,
	ListChecks,
	LockKeyhole,
	ScrollText,
	UserCog,
	UserRound,
	Users,
} from "lucide-react";
import type { SidebarGroup } from "@/types/sidebar.type";

export const adminRoutes: SidebarGroup[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/admin",
				icon: LayoutDashboard,
			},
			{
				title: "Analytics",
				url: "/admin/analytics",
				icon: ChartNoAxesCombined,
			},
		],
	},
	{
		title: "Management",
		items: [
			{
				title: "Users",
				url: "/admin/users",
				icon: Users,
			},
			{
				title: "Submissions",
				url: "/admin/submissions",
				icon: FolderKanban,
			},
			{
				title: "Submit a Project",
				url: "/admin/submissions/new",
				icon: FileText,
			},
			{
				title: "My Submissions",
				url: "/admin/submissions/my-submissions",
				icon: FolderKanban,
			},
			{
				title: "Reviews",
				url: "/admin/reviews",
				icon: ClipboardCheck,
			},
			{
				title: "Review Assignments",
				url: "/admin/assignments",
				icon: UserCog,
			},
			{
				title: "Review Criteria",
				url: "/admin/review-criteria",
				icon: ListChecks,
			},
		],
	},
	{
		title: "System",
		items: [
			{
				title: "Notifications",
				url: "/admin/notifications",
				icon: Bell,
			},
			{
				title: "Activity Log",
				url: "/admin/audit-logs",
				icon: ScrollText,
			},
			{
				title: "My Profile",
				url: "/admin/profile",
				icon: UserRound,
			},
			{
				title: "Update My Profile",
				url: "/admin/update-my-profile",
				icon: Edit,
			},
			{
				title: "Change Password",
				url: "/admin/change-password",
				icon: LockKeyhole,
			},
		],
	},
];
