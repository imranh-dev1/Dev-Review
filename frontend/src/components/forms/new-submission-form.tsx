"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowUpRight,
	Code2,
	FileImage,
	ImagePlus,
	Loader2,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "@/hooks/submission.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";

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
	screenshots: z
		.array(
			z.custom<File>(
				(file) => typeof File !== "undefined" && file instanceof File,
			),
		)
		.max(MAX_SCREENSHOTS, "You can upload up to 5 screenshots.")
		.refine(
			(files) => files.every((file) => file.size <= MAX_FILE_SIZE),
			"Each screenshot must be 5 MB or smaller.",
		)
		.refine(
			(files) => files.every((file) => ALLOWED_TYPES.includes(file.type)),
			"Only JPEG, PNG, and WebP images are allowed.",
		),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface ScreenshotPreview {
	file: File;
	url: string;
}

export function NewSubmissionForm() {
	const router = useRouter();
	const queryClint = useQueryClient();
	const { mutate: createSubmission, isPending } = useCreateSubmission();
	const { data } = useGetMe();
	const [previews, setPreviews] = useState<ScreenshotPreview[]>([]);

	const user = data.data;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<SubmissionFormValues>({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			title: "",
			summary: "",
			description: "",
			repositoryUrl: "",
			liveDemoUrl: "",
			technologies: "",
			screenshots: [],
		},
	});

	const screenshots = watch("screenshots");
	const summary = watch("summary");
	const repositoryUrl = watch("repositoryUrl");
	const liveDemoUrl = watch("liveDemoUrl");

	useEffect(() => {
		const items = screenshots.map((file) => ({
			file,
			url: URL.createObjectURL(file),
		}));

		setPreviews(items);

		return () => {
			items.forEach(({ url }) => {
				URL.revokeObjectURL(url);
			});
		};
	}, [screenshots]);

	const handleScreenshotChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = Array.from(event.target.files ?? []);

		event.target.value = "";

		if (!files.length) return;

		if (screenshots.length + files.length > MAX_SCREENSHOTS) {
			setError("screenshots", {
				type: "manual",
				message: `You can upload up to ${MAX_SCREENSHOTS} screenshots.`,
			});
			return;
		}

		const invalidFile = files.find(
			(file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE,
		);

		if (invalidFile) {
			setError("screenshots", {
				type: "manual",
				message: !ALLOWED_TYPES.includes(invalidFile.type)
					? "Only JPEG, PNG, and WebP images are allowed."
					: "Each screenshot must be 5 MB or smaller.",
			});
			return;
		}

		clearErrors("screenshots");

		setValue("screenshots", [...screenshots, ...files], {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const removeScreenshot = (index: number) => {
		setValue(
			"screenshots",
			screenshots.filter((_, fileIndex) => fileIndex !== index),
			{
				shouldDirty: true,
				shouldValidate: true,
			},
		);

		clearErrors("screenshots");
	};

	const removeAllScreenshots = () => {
		setValue("screenshots", [], {
			shouldDirty: true,
			shouldValidate: true,
		});

		clearErrors("screenshots");
	};

	const onSubmit = (values: SubmissionFormValues) => {
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

		const payload = {
			title: values.title,
			summary: values.summary,
			description: values.description,
			repositoryUrl: values.repositoryUrl,
			liveDemoUrl: values.liveDemoUrl || undefined,
			technologies,
			screenshots: values.screenshots,
		};

		createSubmission(payload, {
			onSuccess: () => {
				toast.success("Submission created successfully.", {
					description: "Your project has been saved as a draft.",
				});
				queryClint.invalidateQueries({
					queryKey: ["my-submissions"],
				});

				router.push(`/${user?.role.toLowerCase()}/submissions/my-submissions`);
			},
			onError: (error) => {
				toast.error("Failed to create submission.", {
					description:
						error instanceof Error ? error.message : "Please try again later.",
				});
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			<Card>
				<CardHeader>
					<CardTitle>Project details</CardTitle>
					<CardDescription>
						Share your project information and help reviewers understand what
						you have built.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-5">
					{/* Project title */}
					<div className="space-y-2">
						<Label htmlFor="title">Project title</Label>

						<InputGroup>
							<InputGroupAddon>
								<Code2 className="size-4" />
							</InputGroupAddon>

							<InputGroupInput
								id="title"
								placeholder="e.g. DevReview Platform"
								maxLength={150}
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
						<Label htmlFor="summary">Project summary</Label>

						<Textarea
							id="summary"
							placeholder="Briefly explain what your project does..."
							className="min-h-24 resize-y"
							maxLength={300}
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
									Write a short overview of your project.
								</p>
							)}

							<span className="shrink-0 text-xs text-muted-foreground">
								{summary.length}/300
							</span>
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Project description</Label>

						<Textarea
							id="description"
							placeholder="Describe the features, architecture, challenges, and goals..."
							className="min-h-44 resize-y"
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
						<Label htmlFor="repositoryUrl">Repository URL</Label>

						<InputGroup>
							<InputGroupAddon>
								<Code2 className="size-4" />
							</InputGroupAddon>

							<InputGroupInput
								id="repositoryUrl"
								type="url"
								placeholder="https://github.com/username/project"
								aria-invalid={!!errors.repositoryUrl}
								{...register("repositoryUrl")}
							/>

							<InputGroupAddon align="inline-end">
								<span className="text-xs text-muted-foreground">GitHub</span>
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
						<Label htmlFor="liveDemoUrl">
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
								id="liveDemoUrl"
								type="url"
								placeholder="https://your-project.vercel.app"
								aria-invalid={!!errors.liveDemoUrl}
								{...register("liveDemoUrl")}
							/>

							<InputGroupAddon align="inline-end">
								<span className="text-xs text-muted-foreground">Live demo</span>
							</InputGroupAddon>
						</InputGroup>

						{errors.liveDemoUrl && (
							<p className="text-sm text-destructive">
								{errors.liveDemoUrl.message}
							</p>
						)}
					</div>

					{/* Technologies */}
					<div className="space-y-2">
						<Label htmlFor="technologies">Technologies</Label>

						<InputGroup>
							<InputGroupAddon>
								<Code2 className="size-4" />
							</InputGroupAddon>

							<InputGroupInput
								id="technologies"
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
				</CardContent>
			</Card>

			{/* Screenshots */}
			<Card>
				<CardHeader>
					<CardTitle>Project screenshots</CardTitle>
					<CardDescription>
						Upload up to 5 screenshots. JPEG, PNG, or WebP, maximum 5 MB per
						image.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{previews.length > 0 && (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
							{previews.map(({ file, url }, index) => (
								<div
									key={url}
									className="overflow-hidden rounded-xl border bg-muted/30"
								>
									<div className="aspect-video">
										<Image
											src={url}
											width={30}
											height={30}
											alt={`Project screenshot ${index + 1}`}
											className="size-full object-cover"
										/>
									</div>

									<div className="flex items-center gap-2 p-2">
										<FileImage className="size-4 shrink-0 text-muted-foreground" />

										<p className="min-w-0 flex-1 truncate text-xs">
											{file.name}
										</p>

										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label={`Remove ${file.name}`}
											className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
											onClick={() => removeScreenshot(index)}
										>
											<X className="size-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}

					{screenshots.length < MAX_SCREENSHOTS && (
						<label
							htmlFor="screenshots"
							className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
						>
							<div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<ImagePlus className="size-6" />
							</div>

							<p className="text-sm font-medium">Select project screenshots</p>

							<p className="mt-1 text-xs text-muted-foreground">
								Choose images from your device
							</p>

							<span className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium">
								<Plus className="size-3.5" />
								Browse images
							</span>

							<input
								id="screenshots"
								type="file"
								accept="image/jpeg,image/png,image/webp"
								multiple
								className="sr-only"
								onChange={handleScreenshotChange}
							/>
						</label>
					)}

					<div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
						<span>
							{screenshots.length} of {MAX_SCREENSHOTS} screenshots selected
						</span>

						{screenshots.length > 0 && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={removeAllScreenshots}
								className="gap-1 text-destructive hover:text-destructive"
							>
								<Trash2 className="size-3.5" />
								Remove all
							</Button>
						)}
					</div>

					{errors.screenshots && (
						<p className="text-sm text-destructive">
							{errors.screenshots.message}
						</p>
					)}
				</CardContent>
			</Card>

			{/* Submit */}
			<div className="flex justify-end">
				<Button type="submit" disabled={isPending} className="gap-2">
					{isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Creating submission...
						</>
					) : (
						<>
							Create submission
							<ArrowUpRight className="size-4" />
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
