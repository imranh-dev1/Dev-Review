import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import type { RequestUser } from "../../middleware/checkAuth";
import { SubmissionValidation } from "./submission.validation";
import { SubmissionServices } from "./submission.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createSubmission = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const uploadedFiles = req.files as
		| Record<string, Express.Multer.File[]>
		| undefined;

	const screenshotFiles = uploadedFiles?.screenshots ?? [];

	const { data: payload } = SubmissionValidation.createSubmissionSchema.parse({
		data: JSON.parse(req.body.data),
	});

	const submission = await SubmissionServices.createSubmission(
		user.userId,
		screenshotFiles,
		payload,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Submission created successfully.",
		data: submission,
	});
});

export const SubmissionControllers = {
	createSubmission,
};
