import { SubmissionList } from "@/components/dashboard/submissions/submission-list";

export default function StudentSubmissionsPage() {
	return (
		<SubmissionList
			title="My Submissions"
			description="Manage your projects and track their review progress."
			createHref="/student/submissions/new"
			detailBasePath="/student/submissions"
		/>
	);
}
