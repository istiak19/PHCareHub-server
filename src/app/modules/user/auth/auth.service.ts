import httpStatus from 'http-status';
import { AppError } from "../../../errors/AppError";
import { prisma } from '../../../shared/prisma';
import bcrypt from "bcryptjs";

const login = async (email: string, password: string) => {
    if (!email || !password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    return user;
};

export const authService = {
    login
};