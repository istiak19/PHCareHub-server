import httpStatus from 'http-status';
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import { Prisma, UserRole } from "@prisma/client";
import calculatePagination, { IOptions } from "../../helpers/paginationHelper";
import { AppError } from "../../errors/AppError";
import { FilterParams } from '../../../constants';
import { userSearchableFields } from '../user/user.constant';
import { JwtPayload } from 'jsonwebtoken';
import { IPatient } from './patient.interface';

const getAllPatient = async (params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.PatientWhereInput[] = [];
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

    const whereConditions: Prisma.PatientWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.patient.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder }
    });

    const total = await prisma.patient.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getByPatient = async (id: string) => {
    const result = await prisma.patient.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });

    return result;
};

const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.patient.profilePhoto = uploadResult?.secure_url
    };

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword
            }
        });

        const patient = await tnx.patient.create({
            data: req.body.patient
        });

        return {
            user,
            patient,
        };
    });

    return result;
};

// const updatePatient = async (id: string, req: Request) => {
//     const isExistPatient = await prisma.patient.findUnique({
//         where: { id }
//     });

//     if (!isExistPatient) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Patient not found");
//     };

//     let parsedData: any = {};
//     if (req.body.data) {
//         parsedData = JSON.parse(req.body.data);
//     };

//     if (req.file) {
//         const uploadResult = await fileUploader.uploadToCloudinary(req.file);
//         parsedData.profilePhoto = uploadResult?.secure_url
//     };

//     const result = await prisma.patient.update({
//         where: { id },
//         data: parsedData
//     });

//     return result;
// };

const updatePatient = async (id: string, payload: IPatient, token: JwtPayload) => {
    const isExistPatient = await prisma.patient.findUnique({
        where: {
            email: token.email,
            isDeleted: false,
        },
    });

    if (!isExistPatient) {
        throw new AppError(httpStatus.BAD_REQUEST, "Patient not found");
    }

    const { medicalReport, patientHealthData, ...patientData } = payload;

    const updatedPatient = await prisma.$transaction(async (tnx) => {
        await tnx.patient.update({
            where: { id },
            data: patientData,
        });

        if (patientHealthData) {
            await tnx.patientHealthData.upsert({
                where: {
                    patientId: isExistPatient.id,
                },
                update: {
                    ...patientHealthData,
                    updatedAt: new Date(),
                } as Prisma.PatientHealthDataUncheckedUpdateInput,
                create: {
                    ...patientHealthData,
                    patientId: isExistPatient.id,
                } as Prisma.PatientHealthDataUncheckedCreateInput,
            });
        };

        if (medicalReport) {
            const reports = Array.isArray(medicalReport) ? medicalReport : [medicalReport];
            await tnx.medicalReport.createMany({
                data: reports.map((report) => ({
                    ...report,
                    patientId: isExistPatient.id,
                })),
            });
        };

        const result = await tnx.patient.findUnique({
            where: {
                id: isExistPatient.id,
            },
            include: {
                patientHealthData: true,
                medicalReport: true,
            },
        });

        return result;
    });

    return updatedPatient;
};

const deletePatient = async (id: string) => {
    const result = await prisma.patient.delete({
        where: { id }
    });

    return result;
};

export const patientService = {
    getAllPatient,
    getByPatient,
    createPatient,
    // updatePatient,
    updatePatient,
    deletePatient
};