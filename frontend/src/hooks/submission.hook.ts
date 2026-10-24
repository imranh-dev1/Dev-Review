import { createSubmission } from "@/api/submission.api";
import { useMutation } from "@tanstack/react-query";

export function useCreateSubmission() {
    return useMutation({
        mutationFn: createSubmission,
    });
}
