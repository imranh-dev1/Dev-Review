import apiClint from "@/lib/apiClint";
import { ICreateReviewPayload } from "@/types/review.types";

export const createReview = (
	submissionId: string,
	payload: ICreateReviewPayload,
) => {
	return apiClint(`/submissions/${submissionId}/reviews`, {
		method: "POST",
		body: payload,
	});
};
