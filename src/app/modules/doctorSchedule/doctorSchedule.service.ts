import httpStatus from 'http-status';
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../errors/AppError";
import calculatePagination, { IOptions } from '../../helpers/paginationHelper';
import { FilterParams } from '../../../constants';
import { Prisma } from '@prisma/client';
import { Gender } from '../user/user.interface';

const createDoctorSchedule = async (user: JwtPayload, payload: { scheduleIds: string[] }) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
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

const getDoctorSchedule = async (
    user: JwtPayload,
    params: FilterParams,
    options: IOptions
) => {
    // 🔹 1. Validate doctor
    const doctorData = await prisma.doctor.findUnique({
        where: { email: user.email },
    });

    if (!doctorData) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime, name, email, gender, designation, currentWorkingPlace } = params;

    const whereConditions: Prisma.DoctorSchedulesWhereInput = {
        doctorId: doctorData.id
    };;

    if (filterStartDateTime || filterEndDateTime) {
        whereConditions.schedule = {};

        if (filterStartDateTime) {
            whereConditions.schedule.startDateTime = {
                gte: filterStartDateTime,
            };
        };

        if (filterEndDateTime) {
            whereConditions.schedule.endDateTime = {
                lte: filterEndDateTime,
            };
        };
    } else if (name || email || gender||designation||currentWorkingPlace) {
        whereConditions.doctor = {};

        if (name) {
            whereConditions.doctor.name = {
                contains: name,
                mode: "insensitive",
            };
        };

        if (email) {
            whereConditions.doctor.email = {
                contains: email,
                mode: "insensitive",
            };
        };

        if (designation) {
            whereConditions.doctor.designation = {
                contains: designation,
                mode: "insensitive",
            };
        };

        if (currentWorkingPlace) {
            whereConditions.doctor.currentWorkingPlace = {
                contains: currentWorkingPlace,
                mode: "insensitive",
            };
        };

        if (gender) {
            whereConditions.doctor.gender = gender as Gender;
        };
    };

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

const deleteDoctorSchedule = async (user: JwtPayload, id: string) => {
    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user.email
        }
    });

    if (!doctorData) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const doctorSchedule = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: id,
            }
        }
    });

    return doctorSchedule;
};

export const doctorScheduleService = {
    createDoctorSchedule,
    getDoctorSchedule,
    deleteDoctorSchedule
};