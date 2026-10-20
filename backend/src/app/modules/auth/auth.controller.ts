import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    AuthServices.registerUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Account register Verification OTP Sent",
        data: null
    })
})

export const AuthControllers = {
    registerUser
}