import apiClint from "@/lib/apiClint";
import { ICreateSubmissionPayload } from "@/types/submission.types";

export const createSubmission = (payload: ICreateSubmissionPayload) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    payload.screenshots.forEach((file) => {
        formData.append("screenshots", file)
    });

    return apiClint("/submissions", {
        method: "POST",
        body: formData,
    });
};
