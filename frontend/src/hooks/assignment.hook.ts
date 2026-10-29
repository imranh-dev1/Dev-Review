import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	acceptAssignment,
	assignReviewer,
	cancelAssignment,
	getAssignments,
	startReview,
} from "@/api/assignment.api";
import type { IAssignmentListQuery } from "@/types/review.types";

export const useGetAssignments = (query?: IAssignmentListQuery) => {
	return useQuery({
		queryKey: ["assignments", query],
		queryFn: () => getAssignments(query),
	});
};

export const useAssignReviewer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			submissionId,
			reviewerId,
		}: {
			submissionId: string;
			reviewerId: string;
		}) => assignReviewer(submissionId, reviewerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
			queryClient.invalidateQueries({ queryKey: ["submissions"] });
		},
	});
};

export const useStartReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (submissionId: string) => startReview(submissionId),
		onSuccess: (_data, submissionId) => {
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
			queryClient.invalidateQueries({ queryKey: ["submissions"] });
			queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
		},
	});
};

export const useAcceptAssignment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (assignmentId: string) => acceptAssignment(assignmentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
		},
	});
};

export const useCancelAssignment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (assignmentId: string) => cancelAssignment(assignmentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
			queryClient.invalidateQueries({ queryKey: ["submissions"] });
		},
	});
};
