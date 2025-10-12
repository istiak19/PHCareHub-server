import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { JwtPayload } from "jsonwebtoken";
import config from '../../config';
import { prisma } from '../shared/prisma';

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken: string | undefined;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            accessToken = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        };

        if (!accessToken) {
            throw new AppError(403, "Unauthorized access: No token provided");
        };

        const verifiedToken = verifyToken(accessToken, config.jwt.JWT_SECRET as string) as JwtPayload;

        const isExistUser = await prisma.user.findUnique({
            where: {
                email: verifiedToken.email
            }
        });

        if (!isExistUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        };

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, `Unauthorized access: Insufficient role ${verifiedToken.role}`);
        };

        req.user = verifiedToken;
        next();
    } catch (err) {
        next(err)
    };
};