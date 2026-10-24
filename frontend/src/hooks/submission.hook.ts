import {
	createSubmission,
	getAllSubmissions,
	getMySubmission,
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
