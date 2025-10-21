import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { role } from "../../../constants/roles";
import { AppError } from "../../errors/AppError";

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

export const prescriptionService = {
    createPrescription
};