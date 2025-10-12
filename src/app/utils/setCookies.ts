import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
};

export const setCookies = (res: Response, token: AuthTokens) => {
    if (token.accessToken) {
        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
    }

    if (token.refreshToken) {
        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
};