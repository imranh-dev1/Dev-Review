"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, UserRoundCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUpdateUserRole } from "@/hooks";
import type { UserRole } from "@/types";

interface UpdateUserRoleDialogProps {
	userId: string;
	userName: string;
	currentRole: UserRole;
}

export function UpdateUserRoleDialog({
	userId,
	userName,
	currentRole,
}: UpdateUserRoleDialogProps) {
	const [open, setOpen] = useState(false);
	const [role, setRole] = useState<"STUDENT" | "REVIEWER">(
		currentRole === "REVIEWER" ? "REVIEWER" : "STUDENT",
	);

	const queryClient = useQueryClient();
	const { mutate: updateUserRole, isPending } = useUpdateUserRole();

	const isAdmin = currentRole === "ADMIN";
	const hasChanges = !isAdmin && role !== currentRole;

	const handleUpdate = () => {
		if (!hasChanges) return;

		updateUserRole(
			{ id: userId, role },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({
						queryKey: ["users"],
					});

					toast.success("User role updated successfully.", {
						description: `${userName} is now a ${role.toLowerCase()}.`,
					});

					setOpen(false);
				},
				onError: (error) => {
					toast.error("Failed to update user role.", {
						description:
							error instanceof Error
								? error.message
								: "Please try again later.",
					});
				},
			},
		);
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (isPending) return;

				setOpen(nextOpen);

				if (nextOpen) {
					setRole(currentRole === "REVIEWER" ? "REVIEWER" : "STUDENT");
				}
			}}
		>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-2"
					disabled={isAdmin}
					title={isAdmin ? "Admin role cannot be changed" : "Update user role"}
				>
					<UserRoundCog className="size-4 text-primary" />
					Role
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
				<AlertDialogHeader className="border-b px-6 py-5">
					<div className="mb-2 flex size-11 items-center justify-center border bg-muted/50">
						<ShieldCheck className="size-5 text-primary" />
					</div>

					<AlertDialogTitle className="text-lg">
						Update user role
					</AlertDialogTitle>

					<AlertDialogDescription className="leading-6">
						Change the role assigned to this user. Their available permissions
						may change accordingly.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-4 px-6 py-5">
					<div className="space-y-1">
						<p className="text-sm font-medium">{userName}</p>
						<p className="text-xs text-muted-foreground">
							Current role: {currentRole}
						</p>
					</div>

					<div className="space-y-2">
						<label htmlFor="user-role" className="text-sm font-medium">
							New role
						</label>

						<Select
							value={role}
							onValueChange={(value) =>
								setRole(value as "STUDENT" | "REVIEWER")
							}
							disabled={isPending}
						>
							<SelectTrigger id="user-role" className="w-full">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="STUDENT">Student</SelectItem>
								<SelectItem value="REVIEWER">Reviewer</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="border bg-muted/30 p-3">
						<p className="text-xs leading-5 text-muted-foreground">
							Only Student and Reviewer roles are available. The Admin role
							cannot be assigned or modified here.
						</p>
					</div>
				</div>

				<AlertDialogFooter className="border-t px-6 py-4">
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

					<AlertDialogAction
						disabled={isPending || !hasChanges}
						onClick={(event) => {
							event.preventDefault();
							handleUpdate();
						}}
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Updating...
							</>
						) : (
							"Update role"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
