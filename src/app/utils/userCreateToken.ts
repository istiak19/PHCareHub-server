import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from "../errors/AppError";
import { generateToken, verifyToken } from './jwt';
import config from '../../config';
import { JwtUser } from '../../constants';

export const userCreateToken = (user: JwtUser) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };
    const accessToken = generateToken(jwtPayload, config.jwt.JWT_SECRET as string, config.jwt.JWT_EXPIRES_IN as string);
    const refreshToken = generateToken(jwtPayload, config.jwt.JWT_REFRESH_SECRET as string, config.jwt.JWT_REFRESH_EXPIRES_IN as string);

    return {
        accessToken,
        refreshToken
    };
};


// export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
//     const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT.JWT_REFRESH_SECRET) as JwtPayload;
//     const isExist = await User.findOne({ email: verifiedRefreshToken.email });
//     if (!isExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
//     };
//     if (isExist.isBlocked === "Blocked" || isExist.isBlocked === "Inactive") {
//         throw new AppError(httpStatus.BAD_REQUEST, `User is ${isExist.isBlocked}`);
//     }
//     if (isExist.isDelete) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
//     };
//     const jwtPayload = {
//         userId: isExist._id,
//         email: isExist.email,
//         role: isExist.role
//     };
//     const accessToken = generateToken(jwtPayload, envVars.JWT.JWT_SECRET, envVars.JWT.JWT_EXPIRES_IN);
//     return accessToken;
// };