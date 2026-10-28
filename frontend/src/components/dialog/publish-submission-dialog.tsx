"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, ShieldCheck } from "lucide-react";
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
import { useSubmitSubmission } from "@/hooks/submission.hook";

interface PublishSubmissionDialogProps {
	submissionId: string;
	submissionTitle: string;
}

export default function PublishSubmissionDialog({
	submissionId,
	submissionTitle,
}: PublishSubmissionDialogProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { mutate: submitSubmission, isPending } = useSubmitSubmission();

	const handlePublish = () => {
		submitSubmission(submissionId, {
			onSuccess: async () => {
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: ["my-submissions"],
					}),
					queryClient.invalidateQueries({
						queryKey: ["submission", submissionId],
					}),
					queryClient.invalidateQueries({
						queryKey: ["reviewer-submissions"],
					}),
					queryClient.invalidateQueries({
						queryKey: ["admin-submissions"],
					}),
				]);

				toast.success("Submission published successfully.", {
					description: "Your project has been submitted for review.",
				});

				setOpen(false);
			},
			onError: (error) => {
				toast.error("Failed to publish submission.", {
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
				if (!isPending) {
					setOpen(nextOpen);
				}
			}}
		>
			<AlertDialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Send className="size-4" />
					Publish
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
				<div className="p-6 pb-5">
					<AlertDialogHeader className="gap-4 text-left">
						<div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
							<Send className="size-5 text-primary" />
						</div>

						<div className="space-y-2">
							<AlertDialogTitle className="text-lg font-semibold tracking-tight">
								Publish your submission?
							</AlertDialogTitle>

							<AlertDialogDescription className="text-sm leading-6">
								Your project will be submitted to the review queue. Make sure
								your project details and links are correct before continuing.
							</AlertDialogDescription>
						</div>
					</AlertDialogHeader>

					<div className="mt-5 flex items-start gap-3 rounded-lg border bg-muted/40 p-3.5">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border">
							<ShieldCheck className="size-4 text-muted-foreground" />
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

					<div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 px-3.5 py-3">
						<p className="text-xs leading-5 text-muted-foreground">
							<span className="font-medium text-foreground">
								What happens next?
							</span>{" "}
							Your submission status will change to{" "}
							<span className="font-medium text-foreground">Submitted</span>,
							and it will be available for review.
						</p>
					</div>
				</div>

				<AlertDialogFooter className="flex-row justify-end gap-2 border-t bg-muted/20 px-6 py-4 sm:space-x-0">
					<AlertDialogCancel asChild>
						<Button variant="outline" disabled={isPending} className="mt-0">
							Cancel
						</Button>
					</AlertDialogCancel>

					<AlertDialogAction asChild>
						<Button
							disabled={isPending}
							onClick={(event) => {
								event.preventDefault();
								handlePublish();
							}}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Publishing...
								</>
							) : (
								<>
									<Send className="mr-2 size-4" />
									Confirm publish
								</>
							)}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
