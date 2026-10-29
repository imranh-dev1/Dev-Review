import apiClint from "@/lib/apiClint";
import type {
	ICreateReviewPayload,
	ICriterionPayload,
	IReviewListQuery,
	IUpdateCriterionPayload,
} from "@/types/review.types";

export const createReview = (
	submissionId: string,
	payload: ICreateReviewPayload,
) => {
	return apiClint(`/submissions/${submissionId}/reviews`, {
		method: "POST",
		body: payload,
	});
};

export const getReviews = (query?: IReviewListQuery) => {
	return apiClint("/reviews", {
		method: "GET",
		query,
	});
};

export const getReviewCriteria = () => {
	return apiClint("/reviews/criteria", {
		method: "GET",
	});
};

export const getAllReviewCriteria = () => {
	return apiClint("/admin/review-criteria", {
		method: "GET",
	});
};

export const createReviewCriterion = (payload: ICriterionPayload) => {
	return apiClint("/admin/review-criteria", {
		method: "POST",
		body: payload,
	});
};

export const updateReviewCriterion = (
	id: string,
	payload: IUpdateCriterionPayload,
) => {
	return apiClint(`/admin/review-criteria/${id}`, {
		method: "PATCH",
		body: payload,
	});
};

export const deleteReviewCriterion = (id: string) => {
	return apiClint(`/admin/review-criteria/${id}`, {
		method: "DELETE",
	});
};
