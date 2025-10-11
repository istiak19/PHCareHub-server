import { Response } from "express";
// import { envVars } from "../config/env.config";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
};

export const setCookies = (res: Response, token: AuthTokens) => {
    // if (token.accessToken) {
    //     res.cookie("accessToken", token.accessToken, {
    //         httpOnly: true,
    //         // secure: envVars.NODE_ENV === "production",
    //         // secure: true,
    //         // sameSite: "none"
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    //     });
    // }
    // if (token.refreshToken) {
    //     res.cookie("refreshToken", token.refreshToken, {
    //         httpOnly: true,
    //         // secure: envVars.NODE_ENV === "production",
    //         // secure: true,
    //         // sameSite: "none"
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    //     });
    // }

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