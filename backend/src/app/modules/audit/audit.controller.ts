import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { AuditServices } from "./audit.service";

const listAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const { rows, meta } = await AuditServices.listAuditLogs(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Audit logs fetched successfully.",
        data: rows,
        meta,
    });
});

const getAuditLogDetail = catchAsync(async (req: Request, res: Response) => {
    const log = await AuditServices.getAuditLogDetail(getParam(req, "id"));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Audit log fetched successfully.",
        data: log,
    });
});

export const AuditControllers = {
    listAuditLogs,
    getAuditLogDetail,
};
