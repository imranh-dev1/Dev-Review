import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getParam } from "../../utils/getParam";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const currentUser = (req: Request) => {
    if (!req.user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }
    return req.user;
};

const listUsers = catchAsync(async (req: Request, res: Response) => {
    const { rows, meta } = await UserServices.listUsers(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully.",
        data: rows,
        meta,
    });
});

const getUserDetail = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.getUserDetail(getParam(req, "id"));

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully.",
        data: user,
    });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.createUser(currentUser(req), req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully.",
        data: user,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.updateUserStatus(
        getParam(req, "id"),
        currentUser(req),
        req.body.status,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully.",
        data: result,
    });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.updateUserRole(
        getParam(req, "id"),
        currentUser(req),
        req.body.role,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User role updated successfully.",
        data: result,
    });
});

export const UserControllers = {
    listUsers,
    getUserDetail,
    createUser,
    updateUserStatus,
    updateUserRole,
};
