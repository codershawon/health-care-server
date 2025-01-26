import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken}= req.cookies;
    console.log(refreshToken)
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token generated successfully!",
        data: result
    })
});
const changePassword = catchAsync(async (req: Request & {user?: any}, res: Response) => {
    console.log(req.user, req.body)
    const result = await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully!",
        data: result
    })
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email!",
        data: null
    })
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await AuthServices.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset!",
        data: null
    })
});

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};