import apiClint from "@/lib/apiClint";
import { ICreateSubmissionPayload, IListQuery } from "@/types/submission.types";

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
