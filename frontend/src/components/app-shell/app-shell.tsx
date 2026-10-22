"use client";

import {
	Bell,
	BookOpenText,
	FilePlus2,
	Files,
	LayoutDashboard,
	LifeBuoy,
	LogOut,
	MessageSquareCode,
	Settings,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { initials } from "@/lib/format";

const studentNav = [
	{ title: "Overview", href: "/dashboard", icon: LayoutDashboard },
	{ title: "My submissions", href: "/submissions", icon: Files },
	{ title: "New submission", href: "/submissions/new", icon: FilePlus2 },
	{ title: "Notifications", href: "/notifications", icon: Bell },
];

const reviewerNav = [
	{ title: "Overview", href: "/dashboard", icon: LayoutDashboard },
	{ title: "Review queue", href: "/queue", icon: ShieldCheck },
	{ title: "My assignments", href: "/assignments", icon: Files },
	{ title: "Notifications", href: "/notifications", icon: Bell },
];

const adminNav = [
	{ title: "Overview", href: "/dashboard", icon: LayoutDashboard },
	{ title: "All submissions", href: "/submissions/all", icon: Files },
	{ title: "Users", href: "/users", icon: UsersRound },
	{ title: "Audit logs", href: "/audit-logs", icon: BookOpenText },
	{ title: "Analytics", href: "/analytics", icon: LayoutDashboard },
	{ title: "Notifications", href: "/notifications", icon: Bell },
];

const sharedNav = [
	{ title: "Profile", href: "/profile", icon: Settings },
	{ title: "Help", href: "/help", icon: LifeBuoy },
];

export function AppSidebar() {
	const { user, logout } = useAuth();
	const pathname = usePathname();
	const items =
		user?.role === "ADMIN"
			? adminNav
			: user?.role === "REVIEWER"
				? reviewerNav
				: studentNav;

	return (
		<Sidebar collapsible="icon" className="border-r border-sidebar-border">
			<SidebarHeader className="border-b border-sidebar-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild size="lg">
							<Link href="/">
								<div className="flex size-8 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
									<MessageSquareCode className="size-4" />
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-sm font-semibold">
										Dev<span className="text-primary">Review</span>
									</span>
									<span className="text-xs text-muted-foreground">
										Project review platform
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										asChild
										isActive={
											pathname === item.href ||
											pathname.startsWith(`${item.href}/`)
										}
										tooltip={item.title}
									>
										<Link href={item.href}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{sharedNav.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.href}
										tooltip={item.title}
									>
										<Link href={item.href}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="size-8">
										<AvatarImage
											src={user?.avatar ?? undefined}
											alt={user?.name}
										/>
										<AvatarFallback className="text-xs">
											{initials(user?.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex min-w-0 flex-col leading-tight">
										<span className="truncate text-sm">
											{user?.name ?? "User"}
										</span>
										<span className="truncate text-xs text-muted-foreground">
											{user?.role ?? ""}
										</span>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" align="start" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col">
										<span className="truncate text-sm">{user?.name}</span>
										<span className="truncate text-xs text-muted-foreground">
											{user?.email}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href="/profile">
											<Settings />
											Profile & settings
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/notifications">
											<Bell />
											Notifications
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => void logout()}
								>
									<LogOut />
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

export function AppHeader() {
	return (
		<header className="flex h-12 items-center gap-2 border-b border-border px-4">
			<SidebarTrigger className="-ml-1" />
			<div className="flex flex-1 items-center justify-between gap-2">
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="hidden sm:inline">Workspace</span>
					<span className="hidden sm:inline">/</span>
					<span className="text-foreground">DevReview</span>
				</div>
				<Button asChild variant="ghost" size="sm" className="hidden sm:flex">
					<Link href="/notifications">
						<Bell className="size-3.5" />
						Notifications
					</Link>
				</Button>
			</div>
		</header>
	);
}

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex min-h-svh w-full flex-1 flex-col">
				<AppHeader />
				<div className="flex flex-1 flex-col">{children}</div>
			</main>
		</SidebarProvider>
	);
}
