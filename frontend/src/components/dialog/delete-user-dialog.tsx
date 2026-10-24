"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, UserRound, X } from "lucide-react";
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
import { useDeleteUser } from "@/hooks";

interface DeleteUserDialogProps {
	userId: string;
	userName: string;
}

export function DeleteUserDialog({ userId, userName }: DeleteUserDialogProps) {
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();
	const { mutate: deleteUser, isPending } = useDeleteUser();

	const handleDelete = () => {
		deleteUser(userId, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: ["users"],
				});

				toast.success("User deleted successfully.", {
					description: `${userName} has been removed from DevReview.`,
				});

				setOpen(false);
			},
			onError: (error) => {
				toast.error("Failed to delete user.", {
					description:
						error instanceof Error ? error.message : "Please try again later.",
				});
			},
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					className="gap-2"
					aria-label={`Delete ${userName}`}
					disabled={isPending}
				>
					<Trash2 className="size-4" />
					Delete
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
				<AlertDialogHeader className="border-b px-6 py-5">
					<div className="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
						<Trash2 className="size-5" />
					</div>

					<AlertDialogTitle className="text-lg">Delete user?</AlertDialogTitle>

					<AlertDialogDescription className="leading-6">
						Are you sure you want to delete{" "}
						<span className="font-medium text-foreground">{userName}</span>?
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="flex items-start gap-3 bg-muted/30 px-6 py-4">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background">
						<UserRound className="size-4 text-muted-foreground" />
					</div>

					<div className="min-w-0 space-y-1">
						<p className="break-words text-sm font-medium">{userName}</p>
						<p className="text-xs text-muted-foreground">User account</p>
					</div>
				</div>

				<AlertDialogFooter className="border-t px-6 py-4 sm:justify-end">
					<AlertDialogCancel disabled={isPending}>
						<X className="mr-2 size-4" />
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={isPending}
						onClick={(event) => {
							event.preventDefault();
							handleDelete();
						}}
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="mr-2 size-4" />
								Delete user
							</>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
