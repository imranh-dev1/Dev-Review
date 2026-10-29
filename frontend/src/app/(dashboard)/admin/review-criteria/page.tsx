"use client";

import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	useCreateReviewCriterion,
	useDeleteReviewCriterion,
	useGetAllReviewCriteria,
	useUpdateReviewCriterion,
} from "@/hooks/review.hook";
import type { ReviewCriterion } from "@/types";

export default function AdminReviewCriteriaPage() {
	const [key, setKey] = useState("");
	const [label, setLabel] = useState("");
	const [weight, setWeight] = useState(1);

	const { data, isPending, isError } = useGetAllReviewCriteria();
	const create = useCreateReviewCriterion();
	const update = useUpdateReviewCriterion();
	const remove = useDeleteReviewCriterion();

	const criteria: ReviewCriterion[] = data?.data ?? [];

	const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!key.trim() || !label.trim()) {
			toast.error("Key and label are required.");
			return;
		}

		create.mutate(
			{ key: key.trim(), label: label.trim(), weight },
			{
				onSuccess: () => {
					toast.success("Criterion created.");
					setKey("");
					setLabel("");
					setWeight(1);
				},
				onError: (error: Error) => toast.error(error.message),
			},
		);
	};

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Management"
				title="Review criteria"
				description="Define the scoring dimensions reviewers use when evaluating projects."
			/>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Add a criterion</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleCreate}
						className="flex flex-col gap-3 lg:flex-row lg:items-end"
					>
						<div className="flex-1 space-y-1.5">
							<Label htmlFor="criterion-key">Key</Label>
							<Input
								id="criterion-key"
								value={key}
								onChange={(event) => setKey(event.target.value)}
								placeholder="e.g. testing"
							/>
						</div>
						<div className="flex-1 space-y-1.5">
							<Label htmlFor="criterion-label">Label</Label>
							<Input
								id="criterion-label"
								value={label}
								onChange={(event) => setLabel(event.target.value)}
								placeholder="e.g. Testing"
							/>
						</div>
						<div className="w-full space-y-1.5 lg:w-32">
							<Label htmlFor="criterion-weight">Weight</Label>
							<Input
								id="criterion-weight"
								type="number"
								min={1}
								max={10}
								value={weight}
								onChange={(event) => setWeight(Number(event.target.value))}
							/>
						</div>
						<Button type="submit" disabled={create.isPending}>
							{create.isPending ? (
								<Loader2 className="mr-2 size-4 animate-spin" />
							) : (
								<Plus className="mr-2 size-4" />
							)}
							Add
						</Button>
					</form>
				</CardContent>
			</Card>

			{isPending ? (
				<ListSkeleton items={4} />
			) : isError ? (
				<p className="border border-dashed p-10 text-center text-sm text-destructive">
					Failed to load criteria.
				</p>
			) : (
				<div className="grid gap-3">
					{criteria.map((criterion) => (
						<Card key={criterion.id} className="py-0">
							<CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="font-medium">{criterion.label}</p>
										<code className="text-xs text-muted-foreground">
											{criterion.key}
										</code>
										<span className="text-xs text-muted-foreground">
											weight {criterion.weight}
										</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{criterion.description ?? "No description."}
									</p>
								</div>

								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<Switch
											checked={criterion.isActive}
											onCheckedChange={(checked) =>
												update.mutate(
													{
														id: criterion.id,
														payload: { isActive: checked },
													},
													{
														onError: (error: Error) =>
															toast.error(error.message),
													},
												)
											}
										/>
										<Label className="text-xs text-muted-foreground">
											Active
										</Label>
									</div>

									<Button
										variant="ghost"
										size="icon"
										disabled={remove.isPending}
										onClick={() =>
											remove.mutate(criterion.id, {
												onSuccess: () => toast.success("Criterion deleted."),
												onError: (error: Error) => toast.error(error.message),
											})
										}
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<p className="flex items-center gap-2 text-xs text-muted-foreground">
				<Save className="size-3" />
				Changes take effect immediately for new reviews.
			</p>
		</div>
	);
}
