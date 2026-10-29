"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
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
import { useDeleteSubmission } from "@/hooks/submission.hook";

interface DeleteSubmissionDialogProps {
	submissionId: string;
	submissionTitle: string;
}

export default function DeleteSubmissionDialog({
	submissionId,
	submissionTitle,
}: DeleteSubmissionDialogProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate: deleteSubmission, isPending: isDeleting } =
		useDeleteSubmission();

	const handleDelete = () => {
		deleteSubmission(submissionId, {
			onSuccess: async (_, id) => {
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: ["my-submissions"],
					}),
					queryClient.invalidateQueries({
						queryKey: ["admin-submissions"],
					}),
					queryClient.invalidateQueries({
						queryKey: ["reviewer-submissions"],
					}),
					queryClient.invalidateQueries({
						queryKey: ["submission", id],
					}),
				]);
				toast.success("Submission deleted successfully.", {
					description: `"${submissionTitle}" has been deleted.`,
				});
				setOpen(false);
			},
			onError: (error) => {
				toast.error("Failed to delete submission.", {
					description:
						error instanceof Error
							? error.message
							: "Something went wrong. Please try again.",
				});
			},
		});
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!isDeleting) {
					setOpen(nextOpen);
				}
			}}
		>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm" className="gap-2">
					<Trash2 className="size-4" />
					Delete
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
				<div className="p-6 pb-5">
					<AlertDialogHeader className="gap-4 text-left">
						<div className="flex size-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10">
							<TriangleAlert className="size-6 text-destructive" />
						</div>

						<div className="space-y-2">
							<AlertDialogTitle className="text-lg font-semibold tracking-tight">
								Delete submission?
							</AlertDialogTitle>

							<AlertDialogDescription className="text-sm leading-6">
								Are you sure you want to delete this submission? This action
								cannot be undone.
							</AlertDialogDescription>
						</div>
					</AlertDialogHeader>

					<div className="mt-5 flex items-start gap-3 rounded-lg border bg-muted/40 p-3.5">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border">
							<Trash2 className="size-4 text-muted-foreground" />
						</div>

						<div className="min-w-0 flex-1 space-y-1">
							<p className="text-xs font-medium text-muted-foreground">
								Submission
							</p>

							<p className="break-words text-sm font-medium leading-5">
								{submissionTitle}
							</p>
						</div>
					</div>
				</div>

				<AlertDialogFooter className="flex-row justify-end gap-2 border-t bg-muted/20 px-6 py-4 sm:space-x-0">
					<AlertDialogCancel asChild>
						<Button variant="outline" disabled={isDeleting} className="mt-0">
							Cancel
						</Button>
					</AlertDialogCancel>

					<AlertDialogAction asChild>
						<Button
							variant="default"
							disabled={isDeleting}
							onClick={(event) => {
								event.preventDefault();
								handleDelete();
							}}
						>
							{isDeleting ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="mr-2 size-4" />
									Delete submission
								</>
							)}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
