import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NewSubmissionForm } from "@/components/forms/new-submission-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "New Submission | DevReview",
	description: "Submit your project for review on DevReview.",
};

export default function NewSubmissionPage() {
	return (
		<main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
			<div className="space-y-4">
				<Button variant="default" size="sm" asChild className="-ml-2 gap-2">
					<Link href="/student/submissions">
						<ArrowLeft className="size-4" />
						Back to submissions
					</Link>
				</Button>

				<div>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
						Create a submission
					</h1>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						Share your project details, source code, demo, and screenshots with
						the DevReview community.
					</p>
				</div>
			</div>

			<NewSubmissionForm />
		</main>
	);
}
