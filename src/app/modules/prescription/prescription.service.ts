import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { role } from "../../../constants/roles";
import { AppError } from "../../errors/AppError";
import calculatePagination, { IOptions } from '../../helpers/paginationHelper';

const createPrescription = async (user: JwtPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });

    if (user.role === role.doctor) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new AppError(httpStatus.BAD_REQUEST, "This is your not appointment");
        };
    };

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null
        },
        include: {
            patient: true
        }
    });

    return result;
};

const getMyPrescription = async (user: JwtPayload, options: IOptions) => {
    const { page, limit, skip } = calculatePagination(options);

    // way-1
    // const isExistPatient = await prisma.patient.findUnique({
    //     where: {
    //         email: user.email
    //     }
    // });

    // if (!isExistPatient) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "Patient not found");
    // };

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: { updateAt: "desc" },
        include: {
            patient: true,
            doctor: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    });
    const totalPages = Math.ceil(total / limit);

    return {
        meta: { page, limit, total, totalPages },
        data: result
    };
};

const getByMyPrescription = async (user: JwtPayload, id: string) => {
    const isExistPatient = await prisma.patient.findUnique({
        where: {
            email: user.email
        }
    });

    if (!isExistPatient) {
        throw new AppError(httpStatus.BAD_REQUEST, "Patient not found");
    };

    const result = await prisma.prescription.findUnique({
        where: {
            patientId: isExistPatient.id,
            id
        },
        include: {
            patient: true,
            doctor: true
        }
    });

    return result;
};

export const prescriptionService = {
    createPrescription,
    getMyPrescription,
    getByMyPrescription
};