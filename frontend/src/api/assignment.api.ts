import apiClint from "@/lib/apiClint";
import type { IAssignmentListQuery } from "@/types/review.types";

export const getAssignments = (query?: IAssignmentListQuery) => {
	return apiClint("/assignments", {
		method: "GET",
		query,
	});
};

export const assignReviewer = (submissionId: string, reviewerId: string) => {
	return apiClint(`/submissions/${submissionId}/assign`, {
		method: "POST",
		body: { reviewerId },
	});
};

export const startReview = (submissionId: string) => {
	return apiClint(`/submissions/${submissionId}/start-review`, {
		method: "POST",
	});
};

export const acceptAssignment = (assignmentId: string) => {
	return apiClint(`/assignments/${assignmentId}/accept`, {
		method: "PATCH",
	});
};

export const cancelAssignment = (assignmentId: string) => {
	return apiClint(`/assignments/${assignmentId}/cancel`, {
		method: "PATCH",
	});
};
