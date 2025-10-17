import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { prisma } from "../../shared/prisma";
import { Prisma } from '@prisma/client';
import { doctorSearchableFields } from '../user/user.constant';
import { FilterParams } from '../../../constants';
import calculatePagination, { IOptions } from '../../helpers/paginationHelper';
import { IDoctorUpdateInput } from './doctor.interface';

const getAllDoctor = async (params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const { searchTerm, specialties, ...filterData } = params;

    const andConditions: Prisma.DoctorWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    };

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
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

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.doctor.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getByDoctor = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id }
    });

    return doctor;
};

const updateDoctor = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const isExistDoctor = await prisma.doctor.findUnique({
        where: { id }
    });

    if (!isExistDoctor) {
        throw new AppError(httpStatus.BAD_REQUEST, "Doctor not found");
    };

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.createMany({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }
        };

        const updatedData = await tnx.doctor.update({
            where: {
                id: id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }
        });

        return updatedData;
    });
};

const deleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.delete({
        where: { id }
    });

    return doctor;
};

export const doctorService = {
    getAllDoctor,
    getByDoctor,
    updateDoctor,
    deleteDoctor
};