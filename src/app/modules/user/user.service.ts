import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import { UserRole } from "@prisma/client";

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
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    };

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const userInfo = {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR
    };

    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: userInfo
        });

        const doctor = await tnx.doctor.create({
            data: req.body.doctor
        });

        return {
            user,
            doctor
        };
    });

    return result;
};

export const userService = {
    createPatient,
    createAdmin,
    createDoctor
};