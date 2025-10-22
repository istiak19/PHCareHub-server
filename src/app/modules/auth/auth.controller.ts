import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { authService } from './auth.service';
import { userCreateToken } from '../../utils/userCreateToken';
import { setCookies } from '../../utils/setCookies';

const login = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body;
    const user = await authService.login(userInfo);
    const userTokens = await userCreateToken(user);
    setCookies(res, userTokens);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successful!",
        data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user
        },
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body;
    const user = await authService.forgotPassword(userInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Check your email!",
        data: user
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/"
    });

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/"
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logout in successfully",
        data: null
    });
});

export const authController = {
    login,
    logout,
    forgotPassword
};