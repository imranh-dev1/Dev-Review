import {
	createSubmission,
	getAllReviewerSubmissions,
	getAllSubmissions,
	getMySubmission,
	getSubmissionDetails,
} from "@/api/submission.api";
import { IListQuery } from "@/types/submission.types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateSubmission() {
	return useMutation({
		mutationFn: createSubmission,
	});
}

export const useGetMySubmissions = (query: IListQuery) =>
	useQuery({
		queryKey: ["my-submissions", query],
		queryFn: () => getMySubmission(query),
	});

export const useListAllSubmissions = (params: IListQuery) => {
	return useQuery({
		queryKey: ["admin-submissions", params],
		queryFn: () => getAllSubmissions(params),
	});
};

export const useListAllReviewerSubmissions = (params: IListQuery) => {
	return useQuery({
		queryKey: ["reviewer-submissions", params],
		queryFn: () => getAllReviewerSubmissions(params),
	});
};

export const useSubmissionDetails = (id: string) => {
	return useQuery({
		queryKey: ["submission", id],
		queryFn: () => getSubmissionDetails(id),
		enabled: !!id,
	});
};
