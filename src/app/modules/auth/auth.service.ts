import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { prisma } from '../../shared/prisma';
import bcrypt from "bcryptjs";
import { UserStatus } from '@prisma/client';
import config from '../../../config';
import sendMailer from '../../utils/sendMailer';
import { generateToken, verifyToken } from '../../utils/jwt';
import { Secret } from 'jsonwebtoken';

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

const getMeUser = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedToken = verifyToken(accessToken, config.jwt.JWT_SECRET as Secret);

    const result = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedToken.email,
            status: UserStatus.ACTIVE
        },
    });

    const { id, email, role, needPasswordChange, status } = result;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    }
};


const forgotPassword = async (payload: { email: string }) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const resetPassToken = generateToken(
        {
            email: isExistUser.email,
            role: isExistUser.role,
        },
        config.jwt.RESET_PASS_SECRET as string,
        config.jwt.RESET_PASS_TOKEN_EXPIRES_IN as string
    );

    const resetPassLink = config.jwt.RESET_PASS_LINK + `?userId=${isExistUser.id}&token=${resetPassToken}`;

    await sendMailer(
        isExistUser.email,
        `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #2b6cb0;">Password Reset Request</h2>
    <p>Dear User,</p>
    <p>We received a request to reset your password. Please click the button below to set a new password:</p>

    <a 
      href="${resetPassLink}" 
      style="
        display: inline-block;
        background-color: #2b6cb0;
        color: white;
        text-decoration: none;
        padding: 10px 18px;
        border-radius: 6px;
        margin-top: 12px;
        font-weight: bold;
      "
    >
      Reset Password
    </a>

    <p style="margin-top: 20px;">
      If you didn’t request this, you can safely ignore this email — your password will remain unchanged.
    </p>

    <p>Best regards,<br><strong>Your Support Team</strong></p>
  </div>
  `
    );
};

export const authService = {
    login,
    getMeUser,
    forgotPassword
};