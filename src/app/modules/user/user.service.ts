import httpStatus from 'http-status';
import { Request } from "express";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import calculatePagination, { IOptions } from "../../helpers/paginationHelper";
import { doctorSearchableFields, userSearchableFields } from "./user.constant";
import { AppError } from "../../errors/AppError";
import { JwtPayload } from 'jsonwebtoken';
import { FilterParams } from '../../../constants';
import { role } from '../../../constants/roles';
import { IStatus } from './user.interface';
import { prisma } from '../../shared/prisma';

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
    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    };

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR
    };

    // Extract specialties from doctor data
    const { specialties, ...doctorData } = req.body.doctor;

    const result = await prisma.$transaction(async (transactionClient) => {
        // Step 1: Create user
        await transactionClient.user.create({
            data: userData,
        });

        // Step 2: Create doctor
        const createdDoctorData = await transactionClient.doctor.create({
            data: doctorData,
        });

        // Step 3: Create doctor specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist
            const existingSpecialties = await transactionClient.specialties.findMany({
                where: {
                    id: {
                        in: specialties,
                    },
                },
                select: {
                    id: true,
                },
            });

            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter(
                (id) => !existingSpecialtyIds.includes(id)
            );

            if (invalidSpecialties.length > 0) {
                throw new Error(
                    `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
                );
            }

            // Create doctor specialties relations
            const doctorSpecialtiesData = specialties.map((specialtyId) => ({
                doctorId: createdDoctorData.id,
                specialitiesId: specialtyId,
            }));

            await transactionClient.doctorSpecialties.createMany({
                data: doctorSpecialtiesData,
            });
        }

        // Step 4: Return doctor with specialties
        const doctorWithSpecialties = await transactionClient.doctor.findUnique({
            where: {
                id: createdDoctorData.id,
            },
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true,
                    },
                },
            },
        });

        return doctorWithSpecialties!;
    });

    return result;
};

const changeProfileStatus = async (token: JwtPayload, id: string, payload: IStatus) => {
    await prisma.user.findUniqueOrThrow({
        where: { id }
    });

    const updateUserStatus = await prisma.user.update({
        where: { id },
        data: payload
    });

    return updateUserStatus;
};

const updateProfile = async (user: JwtPayload, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}


export const userService = {
    getAllUser,
    getMyProfile,
    getByUser,
    updateProfile,
    createAdmin,
    createDoctor,
    changeProfileStatus
};