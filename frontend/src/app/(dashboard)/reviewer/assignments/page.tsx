"use client";

import { useListAllReviewerSubmissions } from "@/hooks/submission.hook";
import { Submission } from "@/types";
import { useState } from "react";

export default function ReviewerAssignmentsPage() {
	const [page, setPage] = useState(1);

	const { data, isPending, isError } = useListAllReviewerSubmissions({
		page,
		limit: 10,
		scope: "all",
	});

	if (isPending) {
		return <p>Loading assigned projects...</p>;
	}

	if (isError) {
		return <p>Failed to load assigned projects.</p>;
	}

	const submissions = data?.data ?? [];
	const meta = data?.meta;

	console.log(data);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Assigned Projects</h1>
				<p className="text-muted-foreground">
					View and manage projects assigned to you for review.
				</p>
			</div>

			<div className="rounded-lg border">
				{submissions.length === 0 ? (
					<p className="p-6 text-center text-muted-foreground">
						No assigned projects found.
					</p>
				) : (
					<div className="divide-y">
						{submissions.map((submission: Submission) => (
							<div key={submission.id} className="space-y-2 p-4">
								<h2 className="font-semibold">{submission.title}</h2>

								<p className="text-sm text-muted-foreground">
									{submission.summary}
								</p>

								<p className="text-sm">Student: {submission.owner?.name}</p>

								<div className="flex flex-wrap gap-2">
									{submission.technologies.map((technology) => (
										<span
											key={technology}
											className="rounded-md bg-muted px-2 py-1 text-xs"
										>
											{technology}
										</span>
									))}
								</div>

								<p className="text-sm">Status: {submission.status}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{meta && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Page {meta.page} of {meta.totalPages}
					</p>

					<div className="flex gap-2">
						<button
							type="button"
							disabled={page <= 1}
							onClick={() => setPage((current) => current - 1)}
							className="rounded-md border px-3 py-2 disabled:opacity-50"
						>
							Previous
						</button>

						<button
							type="button"
							disabled={page >= meta.totalPages}
							onClick={() => setPage((current) => current + 1)}
							className="rounded-md border px-3 py-2 disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
