"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Bell, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks";
import type { IUser, UserRole } from "@/types";

const dashboardRoutes: Record<UserRole, string> = {
	ADMIN: "/admin",
	REVIEWER: "/reviewer",
	STUDENT: "/student",
};

export function NavUserDropdown({ user }: { user: IUser }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate: logout, isPending } = useLogout();

	const dashboardRoute = dashboardRoutes[user.role];

	const menuItems = [
		{
			label: "Account",
			icon: User,
			href: "/account",
		},
		{
			label: "Dashboard",
			icon: LayoutDashboard,
			href: dashboardRoute,
		},
		{
			label: "Notifications",
			icon: Bell,
			href: "/notifications",
		},
	];

	const initials = user.name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	const handleLogout = () => {
		logout(undefined, {
			onSuccess: () => {
				queryClient.clear();

				toast.success("Signed out", {
					description: "You have been logged out successfully.",
				});

				router.replace("/login");
			},
			onError: (error) => {
				toast.error("Sign out failed", {
					description:
						error instanceof Error
							? error.message
							: "Unable to sign out. Please try again.",
				});
			},
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Open user menu"
					className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<Avatar className="size-9 cursor-pointer border">
						<AvatarImage src={user.avatar || undefined} alt={user.name} />
						<AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
							{initials || "U"}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={8}
				className="w-64 p-2"
			>
				<DropdownMenuLabel className="p-2 font-normal">
					<div className="flex items-center gap-3">
						<Avatar className="size-10">
							<AvatarImage src={user.avatar || undefined} alt={user.name} />
							<AvatarFallback className="bg-primary/10 font-semibold text-primary">
								{initials || "U"}
							</AvatarFallback>
						</Avatar>

						<div className="grid min-w-0 flex-1">
							<span className="truncate text-sm font-semibold">
								{user.name}
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
							<span className="text-xs text-muted-foreground">{user.role}</span>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					{menuItems.map(({ label, icon: Icon, href }) => (
						<DropdownMenuItem
							key={label}
							asChild
							className="cursor-pointer gap-2"
						>
							<Link href={href}>
								<Icon className="size-4" />
								<span>{label}</span>
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onSelect={handleLogout}
					disabled={isPending}
					className="mt-2 cursor-pointer gap-2 text-destructive focus:text-destructive"
				>
					<LogOut className="size-4" />
					{isPending ? "Logging out..." : "Log out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
