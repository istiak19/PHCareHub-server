import httpStatus from 'http-status';
import { prisma } from "../../shared/prisma";
import { addMinutes, addHours, format } from "date-fns";
import { ISchedule } from "./schedule.interface";
import { JwtPayload } from "jsonwebtoken";
import calculatePagination, { IOptions } from "../../helpers/paginationHelper";
import { Prisma, Schedule } from "@prisma/client";
import { FilterParams } from "../../../constants";
import { AppError } from "../../errors/AppError";
// import { zonedTimeToUtc } from "date-fns-tz";

const createSchedule = async (payload: ISchedule) => {
    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 11:00

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            };

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
};


// problem solved

// const createSchedule = async (payload: ISchedule) => {
//     const { startDate, endDate, startTime, endTime } = payload;
//     const interval = 30; // minutes
//     const schedules = [];

//     const startDateObj = new Date(startDate);
//     const endDateObj = new Date(endDate);

//     const timeZone = "Asia/Dhaka";

//     // loop through each date
//     for (
//         let currentDate = new Date(startDateObj);
//         currentDate <= endDateObj;
//         currentDate.setDate(currentDate.getDate() + 1)
//     ) {
//         const day = currentDate.toISOString().split("T")[0]; // e.g. 2025-10-17

//         // 🕒 Create local time in BD, then convert to UTC for saving
//         let slotStart = zonedTimeToUtc(`${day} ${startTime}`, timeZone);
//         const dayEnd = zonedTimeToUtc(`${day} ${endTime}`, timeZone);

//         while (slotStart < dayEnd) {
//             const slotEnd = new Date(slotStart.getTime() + interval * 60000); // +30 min

//             const exists = await prisma.schedule.findFirst({
//                 where: {
//                     startDateTime: slotStart,
//                     endDateTime: slotEnd,
//                 },
//             });

//             if (!exists) {
//                 const newSchedule = await prisma.schedule.create({
//                     data: {
//                         startDateTime: slotStart,
//                         endDateTime: slotEnd,
//                     },
//                 });
//                 schedules.push(newSchedule);
//             }

//             slotStart = slotEnd; // move to next slot
//         }
//     }

//     return schedules;
// }

const scheduleForDoctor = async (token: JwtPayload, params: FilterParams, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = params;
    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    };

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: token.email
            }
        },
        select: {
            scheduleId: true
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {};

    const result = await prisma.schedule.findMany({
        skip,
        take: limit,
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        orderBy: { [sortBy]: sortOrder }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getByIdSchedule = async (id: string): Promise<Schedule | null> => {
    const result = await prisma.schedule.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const deleteSchedule = async (token: JwtPayload, id: string) => {
    const userData = await prisma.admin.findUnique({
        where: {
            email: token.email
        }
    });

    if (!userData) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    };

    const schedule = await prisma.schedule.delete({
        where: { id }
    });

    return schedule;
};

export const scheduleService = {
    createSchedule,
    scheduleForDoctor,
    getByIdSchedule,
    deleteSchedule
};