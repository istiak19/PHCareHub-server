import { prisma } from "../../shared/prisma";
import { IPatientUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createPatient = async (payload: IPatientUser) => {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });
        
        const patient = await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email
            }
        });

        return {
            user,
            patient,
        };
    });

    return result;
};

export const userService = {
    createPatient,
};