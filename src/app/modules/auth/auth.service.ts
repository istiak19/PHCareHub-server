import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { prisma } from '../../shared/prisma';
import bcrypt from "bcryptjs";

const login = async (payload: { email: string, password: string }) => {
    if (!payload.email || !payload.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required.");
    };

    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });

    if (!user || !user.password) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    };

    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password.");
    };

    return user;
};

export const authService = {
    login
};