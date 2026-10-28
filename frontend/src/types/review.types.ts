import { ReviewDecision } from ".";

export interface ICreateReviewPayload {
	decision: ReviewDecision;
	feedback: string;
}
