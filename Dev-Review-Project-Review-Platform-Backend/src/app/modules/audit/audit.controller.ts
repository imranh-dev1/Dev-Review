import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AuditServices } from "../../services/audit.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const listAuditLogs = catchAsync(async (req: Request, res: Response) => {
	const { data, meta } = await AuditServices.listAuditLogs(req.query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Audit logs fetched successfully.",
		data,
		meta,
	});
});

export const AuditControllers = {
	listAuditLogs,
};
