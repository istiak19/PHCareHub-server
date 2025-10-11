import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";

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

export const userService = {
    createPatient,
};