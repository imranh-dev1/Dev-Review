"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/review.hook";
import type { ReviewDecision } from "@/types";
import type { ICreateReviewPayload } from "@/types/review.types";

const scoreFields = [
	{ key: "codeQuality", label: "Code Quality" },
	{ key: "functionality", label: "Functionality" },
	{ key: "uiUx", label: "UI / UX" },
	{ key: "responsiveness", label: "Responsiveness" },
	{ key: "accessibility", label: "Accessibility" },
	{ key: "documentation", label: "Documentation" },
] as const;

type ScoreKey = (typeof scoreFields)[number]["key"];

const initialScores: Record<ScoreKey, number> = {
	codeQuality: 7,
	functionality: 7,
	uiUx: 7,
	responsiveness: 7,
	accessibility: 7,
	documentation: 7,
};

export default function ReviewForm({
	submissionId,
	onSuccess,
}: {
	submissionId: string;
	onSuccess?: () => void;
}) {
	const [decision, setDecision] = useState<ReviewDecision>("APPROVED");
	const [feedback, setFeedback] = useState("");
	const [scores, setScores] = useState(initialScores);
	const createReview = useCreateReview();

	const overall =
		Object.values(scores).reduce((sum, value) => sum + value, 0) /
		scoreFields.length;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (feedback.trim().length < 10) {
			toast.error("Feedback must be at least 10 characters long.");
			return;
		}

		const payload: ICreateReviewPayload = {
			decision,
			feedback: feedback.trim(),
			...scores,
		};

		createReview.mutate(
			{ submissionId, payload },
			{
				onSuccess: () => {
					toast.success("Review submitted successfully.");
					setFeedback("");
					setScores(initialScores);
					onSuccess?.();
				},
				onError: (error: Error) => toast.error(error.message),
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Submit a review</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{scoreFields.map(({ key, label }) => (
							<div key={key} className="space-y-1.5">
								<Label htmlFor={`score-${key}`}>{label}</Label>
								<Input
									id={`score-${key}`}
									type="number"
									min={0}
									max={10}
									value={scores[key]}
									onChange={(event) =>
										setScores((current) => ({
											...current,
											[key]: Number(event.target.value),
										}))
									}
								/>
							</div>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label>Decision</Label>
							<Select
								value={decision}
								onValueChange={(value) => setDecision(value as ReviewDecision)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="APPROVED">Approve</SelectItem>
									<SelectItem value="CHANGES_REQUESTED">
										Request changes
									</SelectItem>
									<SelectItem value="REJECTED">Reject</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label>Overall score (auto)</Label>
							<div className="flex h-9 items-center border bg-muted/30 px-3 text-sm font-medium">
								{overall.toFixed(2)} / 10
							</div>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="feedback">Feedback</Label>
						<Textarea
							id="feedback"
							value={feedback}
							onChange={(event) => setFeedback(event.target.value)}
							placeholder="Share constructive feedback for the student..."
							rows={6}
						/>
					</div>

					<Button type="submit" disabled={createReview.isPending}>
						{createReview.isPending ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<Send className="mr-2 size-4" />
						)}
						Submit review
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
