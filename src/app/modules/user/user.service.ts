import httpStatus from 'http-status';
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import { Prisma, UserRole } from "@prisma/client";
import calculatePagination, { IOptions } from "../../helpers/paginationHelper";
import { doctorSearchableFields, userSearchableFields } from "./user.constant";
import { AppError } from "../../errors/AppError";
import { JwtPayload } from 'jsonwebtoken';
import { FilterParams } from '../../../constants';
import { role } from '../../../constants/roles';

const getAllUser = async (params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            doctor: true,
            patient: true,
            admin: true
        }
    });

    const total = await prisma.user.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getMyProfile = async (email: string) => {
    const result = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    });

    let profileData;

    if (role.patient === result?.role) {
        profileData = await prisma.patient.findUnique({
            where: {
                email: result.email
            }
        });
    }
    else if (role.doctor === result?.role) {
        profileData = await prisma.doctor.findUnique({
            where: {
                email: result.email
            }
        });
    }
    else if (role.admin === result?.role) {
        profileData = await prisma.admin.findUnique({
            where: {
                email: result.email
            }
        });
    };

    return {
        ...result,
        ...profileData
    };
};

const getByUser = async (token: JwtPayload, id: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            id: token.userId
        }
    });

    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const result = await prisma.user.findUnique({
        where: { id }
    });

    return result;
};

// const createPatient = async (req: Request) => {
//     if (req.file) {
//         const uploadResult = await fileUploader.uploadToCloudinary(req.file);
//         req.body.patient.profilePhoto = uploadResult?.secure_url
//     };

//     const hashPassword = await bcrypt.hash(req.body.password, 10);
//     const result = await prisma.$transaction(async (tnx) => {
//         const user = await tnx.user.create({
//             data: {
//                 email: req.body.patient.email,
//                 password: hashPassword
//             }
//         });

//         const patient = await tnx.patient.create({
//             data: req.body.patient
//         });

//         return {
//             user,
//             patient,
//         };
//     });

//     return result;
// };

const createAdmin = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePhoto = uploadResult?.secure_url
    };

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const userInfo = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
    };

    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: userInfo
        });

        const admin = await tnx.admin.create({
            data: req.body.admin
        });

        return {
            user,
            admin
        };
    });

    return result;
};

const createDoctor = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    };

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const userInfo = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR
    };

    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: userInfo
        });

        const doctor = await tnx.doctor.create({
            data: req.body.doctor
        });

        return {
            user,
            doctor
        };
    });

    return result;
};

export const userService = {
    getAllUser,
    getMyProfile,
    getByUser,
    // createPatient,
    createAdmin,
    createDoctor
};