"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { useUpdateUserStatus } from "@/hooks";
import type { UserStatus } from "@/types";

interface UserStatusDialogProps {
	userId: string;
	userName: string;
	status: UserStatus;
}

const statuses: UserStatus[] = ["ACTIVE", "SUSPENDED", "DEACTIVATED"];

export default function UserStatusDialog({
	userId,
	userName,
	status,
}: UserStatusDialogProps) {
	const [open, setOpen] = useState(false);
	const [nextStatus, setNextStatus] = useState<UserStatus>(status);
	const { mutate, isPending } = useUpdateUserStatus();
	const queryClient = useQueryClient();

	const handleOpenChange = (value: boolean) => {
		if (isPending) return;

		setOpen(value);

		if (value) {
			setNextStatus(status);
		}
	};

	const handleSubmit = () => {
		if (nextStatus === status) return;

		mutate(
			{ id: userId, status: nextStatus },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["users"],
					});

					toast.success(`${userName}'s status updated successfully.`);
					setOpen(false);
				},
				onError: (error) => {
					toast.error("Failed to update user status.", {
						description:
							error instanceof Error
								? error.message
								: "Something went wrong. Please try again.",
					});
				},
			},
		);
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					{status === "ACTIVE" ? (
						<ShieldOff className="mr-2 size-4 text-primary" />
					) : (
						<ShieldCheck className="mr-2 size-4 text-primary" />
					)}
					Status
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change User Status</AlertDialogTitle>
					<AlertDialogDescription>
						Choose a new status for <strong>{userName}</strong>.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="grid gap-2">
					{statuses.map((option) => (
						<Button
							key={option}
							type="button"
							variant={nextStatus === option ? "default" : "outline"}
							className="justify-start"
							disabled={isPending}
							onClick={() => setNextStatus(option)}
						>
							{option.replace("_", " ")}
							{status === option && " (Current)"}
						</Button>
					))}
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

					<AlertDialogAction
						disabled={isPending || nextStatus === status}
						onClick={(event) => {
							event.preventDefault();
							handleSubmit();
						}}
					>
						{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
						{isPending ? "Updating..." : "Update Status"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
