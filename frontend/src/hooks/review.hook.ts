import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createReview,
	createReviewCriterion,
	deleteReviewCriterion,
	getAllReviewCriteria,
	getReviewCriteria,
	getReviews,
	updateReviewCriterion,
} from "@/api/review.api";
import type {
	ICreateReviewPayload,
	ICriterionPayload,
	IReviewListQuery,
	IUpdateCriterionPayload,
} from "@/types/review.types";

export const useCreateReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			submissionId,
			payload,
		}: {
			submissionId: string;
			payload: ICreateReviewPayload;
		}) => createReview(submissionId, payload),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
			queryClient.invalidateQueries({ queryKey: ["submissions"] });
			queryClient.invalidateQueries({
				queryKey: ["submission", variables.submissionId],
			});
		},
	});
};

export const useGetReviews = (query?: IReviewListQuery) => {
	return useQuery({
		queryKey: ["reviews", query],
		queryFn: () => getReviews(query),
	});
};

export const useGetReviewCriteria = () => {
	return useQuery({
		queryKey: ["review-criteria"],
		queryFn: getReviewCriteria,
	});
};

export const useGetAllReviewCriteria = () => {
	return useQuery({
		queryKey: ["review-criteria", "all"],
		queryFn: getAllReviewCriteria,
	});
};

export const useCreateReviewCriterion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ICriterionPayload) => createReviewCriterion(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["review-criteria"] });
		},
	});
};

export const useUpdateReviewCriterion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: IUpdateCriterionPayload;
		}) => updateReviewCriterion(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["review-criteria"] });
		},
	});
};

export const useDeleteReviewCriterion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteReviewCriterion(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["review-criteria"] });
		},
	});
};
