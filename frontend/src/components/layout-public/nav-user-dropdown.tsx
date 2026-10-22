"use client";

import { useRouter } from "next/navigation"; 

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, LayoutDashboard, LogOut, User } from "lucide-react"; 

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  onLogout?: () => void;
};

export function NavUserDropdown({ user, onLogout }: NavUserProps) {
  const router = useRouter();

const initials = user.name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>  
        <button
          type="button"
          aria-label="Open user menu"
          className="rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-9 cursor-pointer border">
            <AvatarImage
              src={user.avatar || undefined}
              alt={user.name}
            />
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
              <AvatarImage
                src={user.avatar || undefined}
                alt={user.name}
              />
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
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => router.push("/account")}
            className="cursor-pointer gap-2"
          >
            <User className="size-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/billing")}
            className="cursor-pointer gap-2"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/notifications")}
            className="cursor-pointer gap-2"
          >
            <Bell className="size-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={onLogout}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive mt-2"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}