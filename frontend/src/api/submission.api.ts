import apiClint from "@/lib/apiClint";
import type {
	ICreateSubmissionPayload,
	IListQuery,
	IUpdateSubmissionPayload,
} from "@/types/submission.types";

export const createSubmission = (payload: ICreateSubmissionPayload) => {
	const formData = new FormData();

	formData.append("data", JSON.stringify(payload));

	payload.screenshots.forEach((file) => {
		formData.append("screenshots", file);
	});

	return apiClint("/submissions", {
		method: "POST",
		body: formData,
	});
};

export const getMySubmission = (query: IListQuery) => {
	return apiClint("/submissions/my", {
		method: "GET",
		query,
	});
};

export const getAllSubmissions = (query: IListQuery) => {
	return apiClint("/submissions", {
		method: "GET",
		query,
	});
};

export const getAllReviewerSubmissions = (query: IListQuery) => {
	return apiClint("/submissions/reviewer", {
		method: "GET",
		query,
	});
};

export const getSubmissionDetails = (id: string) => {
	return apiClint(`/submissions/${id}`, {
		method: "GET",
	});
};

export const updateSubmission = (
	id: string,
	payload: IUpdateSubmissionPayload,
) => {
	const formData = new FormData();

	formData.append("data", JSON.stringify(payload));

	payload.screenshots.forEach((file) => {
		formData.append("screenshots", file);
	});

	return apiClint(`/submissions/${id}`, {
		method: "PATCH",
		body: formData,
	});
};

export const deleteSubmission = (id: string) => {
	return apiClint(`/submissions/${id}`, {
		method: "DELETE",
	});
};

export const submitSubmission = (id: string) => {
	return apiClint(`/submissions/${id}/submit`, {
		method: "POST",
	});
};
