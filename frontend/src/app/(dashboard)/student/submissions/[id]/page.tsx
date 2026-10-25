"use client";

import AuthLoading from "@/components/auth/auth-loading";
import SubmissionDetails from "@/components/dashboard/submissions/submission-details";
import { useSubmissionDetails } from "@/hooks/submission.hook";
import { useParams } from "next/navigation";

export default function SubmissionDetailsPage() {
	const { id } = useParams<{ id: string }>();

	const { data, isLoading } = useSubmissionDetails(id);

	const submission = data?.data;

	if (isLoading) {
		return <AuthLoading value="Loading submission..." />;
	}

	return <SubmissionDetails submission={submission} />;
}
