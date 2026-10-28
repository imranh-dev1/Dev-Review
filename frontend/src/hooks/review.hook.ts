import { createReview } from "@/api/review.api";
import { ICreateReviewPayload } from "@/types/review.types";
import { useMutation } from "@tanstack/react-query";

export const useCreateReview = () => {
	return useMutation({
		mutationFn: ({
			submissionId,
			payload,
		}: {
			submissionId: string;
			payload: ICreateReviewPayload;
		}) => createReview(submissionId, payload),
	});
};
