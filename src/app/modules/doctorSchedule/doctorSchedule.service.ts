import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../errors/AppError";
import calculatePagination, { IOptions } from '../../helpers/paginationHelper';
import { FilterParams } from '../../../constants';
import { Prisma } from '@prisma/client';
import { Gender } from '../user/user.interface';
import { role } from '../../../constants/roles';

const createDoctorSchedule = async (token: JwtPayload, payload: { scheduleIds: string[] }) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: token.email
        }
    });

    if (!doctorData) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }));

    const doctorSchedule = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });

    return doctorSchedule;
};

const getAllDoctorSchedule = async (token: JwtPayload, params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const isExistUser = await prisma.user.findUnique({
        where: {
            email: token.email
        },
    });

    if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            doctor: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBook === 'string' && filterData.isBook === 'true') {
            filterData.isBook = true;
        } else if (typeof filterData.isBook === 'string' && filterData.isBook === 'false') {
            filterData.isBook = false;
        }
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: Prisma.DoctorSchedulesWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        include: {
            doctor: true,
            schedule: true,
        },
        skip,
        take: limit,
        orderBy: {
            schedule: {
                [sortBy || "startDateTime"]: sortOrder || "asc",
            },
        },
    });

    const total = await prisma.doctorSchedules.count({
        where: whereConditions,
    });

    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: doctorSchedules,
    };
};

const getDoctorSchedule = async (token: JwtPayload, params: FilterParams, options: IOptions) => {

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { startDate, endDate, ...filterData } = params;

    const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {

        if (typeof filterData.isBook === 'string' && filterData.isBook === 'true') {
            filterData.isBook = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBook === 'false') {
            filterData.isBook= false
        };

        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.DoctorSchedulesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        include: {
            doctor: true,
            schedule: true,
        },
        skip,
        take: limit,
        orderBy: {
            schedule: {
                [sortBy || "startDateTime"]: sortOrder || "asc",
            },
        },
    });

    const total = await prisma.doctorSchedules.count({
        where: whereConditions,
    });

    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: doctorSchedules,
    };
};

const deleteDoctorSchedule = async (token: JwtPayload, id: string) => {
    const isExistDoctor = await prisma.doctor.findUnique({
        where: {
            email: token.email
        }
    });

    if (!isExistDoctor) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const isBookedSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: isExistDoctor.id,
            scheduleId: id,
            isBook: true
        }
    });

    if (isBookedSchedule) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!");
    };

    const doctorSchedule = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: isExistDoctor.id,
                scheduleId: id,
            }
        }
    });

    return doctorSchedule;
};

export const doctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedule,
    getAllDoctorSchedule,
    deleteDoctorSchedule
};