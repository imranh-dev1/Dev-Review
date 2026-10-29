"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
	ArrowUpRight,
	Code2,
	ImagePlus,
	Loader2,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useSubmissionDetails,
	useUpdateSubmission,
} from "@/hooks/submission.hook";

import type { Submission } from "@/types";
import type { IUpdateSubmissionPayload } from "@/types/submission.types";
import AuthLoading from "../auth/auth-loading";

const MAX_SCREENSHOTS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TECHNOLOGIES = 20;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const submissionSchema = z.object({
	title: z
		.string()
		.trim()
		.min(3, "Title must be at least 3 characters.")
		.max(150, "Title cannot exceed 150 characters."),

	summary: z
		.string()
		.trim()
		.min(10, "Summary must be at least 10 characters.")
		.max(300, "Summary cannot exceed 300 characters."),

	description: z
		.string()
		.trim()
		.min(1, "Description is required.")
		.max(50000, "Description is too long."),

	repositoryUrl: z.url("Enter a valid repository URL.").max(2048),

	liveDemoUrl: z.union([
		z.literal(""),
		z.url("Enter a valid live demo URL.").max(2048),
	]),

	technologies: z.string().max(1000, "Technology list is too long."),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface UpdateSubmissionFormProps {
	id: string;
	onCancel: () => void;
}

export default function UpdateSubmissionForm({
	id,
	onCancel,
}: UpdateSubmissionFormProps) {
	const [newScreenshots, setNewScreenshots] = useState<File[]>([]);
	const [removedScreenshots, setRemovedScreenshots] = useState<string[]>([]);
	const [screenshotError, setScreenshotError] = useState("");
	const queryClient = useQueryClient();

	const { data, isLoading } = useSubmissionDetails(id);

	const submission = data?.data as Submission | undefined;

	const { mutateAsync: updateSubmission, isPending } = useUpdateSubmission();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		watch,
		formState: { errors, isDirty },
	} = useForm<SubmissionFormValues>({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			title: "",
			summary: "",
			description: "",
			repositoryUrl: "",
			liveDemoUrl: "",
			technologies: "",
		},
	});

	const summary = watch("summary");

	useEffect(() => {
		if (!submission) return;

		reset({
			title: submission.title ?? "",
			summary: submission.summary ?? "",
			description: submission.description ?? "",
			repositoryUrl: submission.repositoryUrl ?? "",
			liveDemoUrl: submission.liveDemoUrl ?? "",
			technologies: submission.technologies?.join(", ") ?? "",
		});

		setNewScreenshots([]);
		setRemovedScreenshots([]);
		setScreenshotError("");
	}, [submission, reset]);

	const existingScreenshots = (submission?.screenshots ?? []).filter(
		(url: string) => !removedScreenshots.includes(url),
	);

	const totalScreenshots = existingScreenshots.length + newScreenshots.length;

	const handleScreenshotChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);

		// Allow selecting the same file again.
		event.target.value = "";

		if (files.length === 0) return;

		if (totalScreenshots + files.length > MAX_SCREENSHOTS) {
			setScreenshotError(
				`You can upload up to ${MAX_SCREENSHOTS} screenshots.`,
			);
			return;
		}

		const invalidFile = files.find(
			(file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE,
		);

		if (invalidFile) {
			setScreenshotError(
				!ALLOWED_TYPES.includes(invalidFile.type)
					? "Only JPEG, PNG, and WebP images are allowed."
					: "Each screenshot must be 5 MB or smaller.",
			);
			return;
		}

		setScreenshotError("");
		setNewScreenshots((current) => [...current, ...files]);
	};

	const removeNewScreenshot = (fileToRemove: File) => {
		setNewScreenshots((current) =>
			current.filter((file) => file !== fileToRemove),
		);

		setScreenshotError("");
	};

	const removeExistingScreenshot = (url: string) => {
		setRemovedScreenshots((current) =>
			current.includes(url) ? current : [...current, url],
		);

		setScreenshotError("");
	};

	const restoreRemovedScreenshots = () => {
		setRemovedScreenshots([]);
		setScreenshotError("");
	};

	const onSubmit = async (values: SubmissionFormValues) => {
		if (!submission) {
			toast.error("Submission details are not available.");
			return;
		}

		const technologies = [
			...new Set(
				values.technologies
					.split(",")
					.map((technology) => technology.trim())
					.filter(Boolean),
			),
		];

		if (technologies.length > MAX_TECHNOLOGIES) {
			setError("technologies", {
				type: "manual",
				message: `You can add up to ${MAX_TECHNOLOGIES} technologies.`,
			});
			return;
		}

		if (totalScreenshots > MAX_SCREENSHOTS) {
			setScreenshotError(
				`You can upload up to ${MAX_SCREENSHOTS} screenshots.`,
			);
			return;
		}

		const payload: IUpdateSubmissionPayload = {
			title: values.title,
			summary: values.summary,
			description: values.description,
			repositoryUrl: values.repositoryUrl,
			liveDemoUrl: values.liveDemoUrl,
			technologies,
			screenshotPreUrls: existingScreenshots,
			screenshots: newScreenshots,
		};

		await updateSubmission(
			{
				id: submission.id,
				payload,
			},
			{
				onSuccess: (_, variables) => {
					queryClient.invalidateQueries({
						queryKey: ["my-submissions"],
					});
					queryClient.invalidateQueries({
						queryKey: ["submission", variables.id],
					});
					queryClient.invalidateQueries({
						queryKey: ["admin-submissions"],
					});
					queryClient.invalidateQueries({
						queryKey: ["reviewer-submissions"],
					});
					toast.success("Submission updated successfully.", {
						description: "Your project changes have been saved.",
					});

					onCancel();
				},
				onError: (error) => {
					toast.error("Failed to update submission.", {
						description:
							error instanceof Error
								? error.message
								: "Please try again later.",
					});
				},
			},
		);
	};

	if (isLoading) {
		return <AuthLoading value="Loading submission..." />;
	}

	if (!submission) {
		return (
			<div className="py-8 text-center">
				<p className="text-sm text-muted-foreground">Submission not found.</p>

				<Button
					type="button"
					variant="outline"
					className="mt-4"
					onClick={onCancel}
				>
					Close
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			<div className="space-y-5">
				{/* Project title */}
				<div className="space-y-2">
					<Label htmlFor="update-title">Project title</Label>

					<InputGroup>
						<InputGroupAddon>
							<Code2 className="size-4" />
						</InputGroupAddon>

						<InputGroupInput
							id="update-title"
							maxLength={150}
							placeholder="e.g. DevReview Platform"
							aria-invalid={!!errors.title}
							{...register("title")}
						/>
					</InputGroup>

					{errors.title && (
						<p className="text-sm text-destructive">{errors.title.message}</p>
					)}
				</div>

				{/* Summary */}
				<div className="space-y-2">
					<Label htmlFor="update-summary">Project summary</Label>

					<Textarea
						id="update-summary"
						maxLength={300}
						className="min-h-24 resize-y"
						placeholder="Briefly explain what your project does..."
						aria-invalid={!!errors.summary}
						{...register("summary")}
					/>

					<div className="flex justify-between gap-3">
						{errors.summary ? (
							<p className="text-sm text-destructive">
								{errors.summary.message}
							</p>
						) : (
							<p className="text-xs text-muted-foreground">
								Write a short project overview.
							</p>
						)}

						<span className="shrink-0 text-xs text-muted-foreground">
							{summary.length}/300
						</span>
					</div>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label htmlFor="update-description">Project description</Label>

					<Textarea
						id="update-description"
						className="min-h-44 resize-y"
						placeholder="Describe the features, architecture, challenges, and goals..."
						aria-invalid={!!errors.description}
						{...register("description")}
					/>

					{errors.description && (
						<p className="text-sm text-destructive">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Repository URL */}
				<div className="space-y-2">
					<Label htmlFor="update-repositoryUrl">Repository URL</Label>

					<InputGroup>
						<InputGroupAddon>
							<Code2 className="size-4" />
						</InputGroupAddon>

						<InputGroupInput
							id="update-repositoryUrl"
							type="url"
							placeholder="https://github.com/username/project"
							aria-invalid={!!errors.repositoryUrl}
							{...register("repositoryUrl")}
						/>

						<InputGroupAddon align="inline-end">
							<InputGroupText>GitHub</InputGroupText>
						</InputGroupAddon>
					</InputGroup>

					{errors.repositoryUrl && (
						<p className="text-sm text-destructive">
							{errors.repositoryUrl.message}
						</p>
					)}
				</div>

				{/* Live demo URL */}
				<div className="space-y-2">
					<Label htmlFor="update-liveDemoUrl">
						Live demo URL{" "}
						<span className="font-normal text-muted-foreground">
							(Optional)
						</span>
					</Label>

					<InputGroup>
						<InputGroupAddon>
							<ArrowUpRight className="size-4" />
						</InputGroupAddon>

						<InputGroupInput
							id="update-liveDemoUrl"
							type="url"
							placeholder="https://your-project.vercel.app"
							aria-invalid={!!errors.liveDemoUrl}
							{...register("liveDemoUrl")}
						/>
					</InputGroup>

					{errors.liveDemoUrl && (
						<p className="text-sm text-destructive">
							{errors.liveDemoUrl.message}
						</p>
					)}
				</div>

				{/* Technologies */}
				<div className="space-y-2">
					<Label htmlFor="update-technologies">Technologies</Label>

					<InputGroup>
						<InputGroupAddon>
							<Code2 className="size-4" />
						</InputGroupAddon>

						<InputGroupInput
							id="update-technologies"
							placeholder="React, Next.js, TypeScript, PostgreSQL"
							aria-invalid={!!errors.technologies}
							{...register("technologies")}
						/>

						<InputGroupAddon align="inline-end">
							<InputGroupText>Max 20</InputGroupText>
						</InputGroupAddon>
					</InputGroup>

					<p className="text-xs text-muted-foreground">
						Separate technologies with commas.
					</p>

					{errors.technologies && (
						<p className="text-sm text-destructive">
							{errors.technologies.message}
						</p>
					)}
				</div>

				{/* Screenshots */}
				<div className="space-y-3">
					<div>
						<Label>Project screenshots</Label>

						<p className="mt-1 text-sm text-muted-foreground">
							Upload up to 5 images. JPEG, PNG, or WebP; maximum 5 MB each.
						</p>
					</div>

					{totalScreenshots > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{/* Existing screenshots */}
							{existingScreenshots.map((url) => (
								<div key={url} className="overflow-hidden rounded-xl border">
									<div className="relative aspect-video">
										<Image
											src={url}
											alt="Existing project screenshot"
											fill
											unoptimized
											sizes="(max-width: 640px) 50vw, 200px"
											className="object-cover"
										/>
									</div>

									<div className="flex items-center justify-between gap-2 p-2">
										<span className="min-w-0 flex-1 truncate text-xs">
											Existing image
										</span>

										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-8 shrink-0 text-destructive"
											aria-label="Remove screenshot"
											disabled={isPending}
											onClick={() => removeExistingScreenshot(url)}
										>
											<X className="size-4" />
										</Button>
									</div>
								</div>
							))}

							{/* Newly selected screenshots */}
							{newScreenshots.map((file) => (
								<ScreenshotPreview
									key={`${file.name}-${file.size}-${file.lastModified}`}
									file={file}
									onRemove={() => removeNewScreenshot(file)}
									disabled={isPending}
								/>
							))}
						</div>
					)}

					{totalScreenshots < MAX_SCREENSHOTS && (
						<label
							htmlFor="update-screenshots"
							className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
						>
							<div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<ImagePlus className="size-6" />
							</div>

							<p className="text-sm font-medium">Add project screenshots</p>

							<p className="mt-1 text-xs text-muted-foreground">
								Choose images from your device
							</p>

							<span className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium">
								<Plus className="size-3.5" />
								Browse images
							</span>

							<input
								id="update-screenshots"
								type="file"
								accept="image/jpeg,image/png,image/webp"
								multiple
								disabled={isPending}
								className="sr-only"
								onChange={handleScreenshotChange}
							/>
						</label>
					)}

					<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
						<span>
							{totalScreenshots} of {MAX_SCREENSHOTS} screenshots
						</span>

						{removedScreenshots.length > 0 && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								disabled={isPending}
								onClick={restoreRemovedScreenshots}
							>
								Undo removed images
							</Button>
						)}
					</div>

					{screenshotError && (
						<p className="text-sm text-destructive">{screenshotError}</p>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-2 border-t pt-4">
				<Button
					type="button"
					variant="outline"
					disabled={isPending}
					onClick={onCancel}
				>
					Cancel
				</Button>

				<Button
					type="submit"
					disabled={
						isPending ||
						(!isDirty &&
							newScreenshots.length === 0 &&
							removedScreenshots.length === 0)
					}
					className="gap-2"
				>
					{isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Updating submission...
						</>
					) : (
						<>
							Update submission
							<ArrowUpRight className="size-4" />
						</>
					)}
				</Button>
			</div>
		</form>
	);
}

function ScreenshotPreview({
	file,
	onRemove,
	disabled,
}: {
	file: File;
	onRemove: () => void;
	disabled: boolean;
}) {
	const [previewUrl, setPreviewUrl] = useState("");

	useEffect(() => {
		const url = URL.createObjectURL(file);

		setPreviewUrl(url);

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [file]);

	return (
		<div className="overflow-hidden rounded-xl border">
			<div className="relative aspect-video">
				{previewUrl && (
					<Image
						src={previewUrl}
						alt={file.name}
						fill
						unoptimized
						sizes="(max-width: 640px) 50vw, 200px"
						className="object-cover"
					/>
				)}
			</div>

			<div className="flex items-center justify-between gap-2 p-2">
				<span className="min-w-0 flex-1 truncate text-xs">{file.name}</span>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-8 shrink-0 text-destructive"
					aria-label={`Remove ${file.name}`}
					disabled={disabled}
					onClick={onRemove}
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		</div>
	);
}
