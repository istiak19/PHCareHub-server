import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { authService } from './auth.service';
import { userCreateToken } from '../../../utils/userCreateToken';
import { setCookies } from '../../../utils/setCookies';

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
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

export const authController = {
    login,
};