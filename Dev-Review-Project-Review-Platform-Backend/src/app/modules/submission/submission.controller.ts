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

const listMySubmissions = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const { data, meta } = await SubmissionServices.listMySubmissions(
		user.userId,
		req.query,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submissions fetched successfully.",
		data: data,
		meta,
	});
});

const listAllSubmissions = catchAsync(async (req: Request, res: Response) => {
	const { data, meta } = await SubmissionServices.listAllSubmissions(req.query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submissions fetched successfully.",
		data: data,
		meta,
	});
});

const listReviewerSubmissions = catchAsync(
	async (req: Request, res: Response) => {
		const user = req?.user as RequestUser;

		const { data, meta } = await SubmissionServices.listReviewerSubmissions(
			req.query,
			user.userId,
		);

		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Reviewer Submissions fetched successfully.",
			data: data,
			meta,
		});
	},
);

const getSubmissionDetails = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params?.id as string;

	const submission = await SubmissionServices.getSubmissionDetails(id, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submission fetched successfully.",
		data: submission,
	});
});

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as RequestUser;
	const id = req.params.id;

	const uploadedFiles = req.files as
		| Record<string, Express.Multer.File[]>
		| undefined;

	const screenshotFiles = uploadedFiles?.screenshots ?? [];

	const requestData = JSON.parse(req.body.data);

	const { data: payload } = SubmissionValidation.updateSubmissionSchema.parse({
		data: requestData,
	});

	const screenshotPreUrls = Array.isArray(requestData.screenshotPreUrls)
		? requestData.screenshotPreUrls.filter(
				(url: unknown): url is string => typeof url === "string",
			)
		: [];

	const submission = await SubmissionServices.updateSubmission(
		id as string,
		user,
		{
			...payload,
			screenshotPreUrls,
		},
		screenshotFiles,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submission updated successfully.",
		data: submission,
	});
});

export const SubmissionControllers = {
	createSubmission,
	listMySubmissions,
	listAllSubmissions,
	listReviewerSubmissions,
	getSubmissionDetails,
	updateSubmission,
};
