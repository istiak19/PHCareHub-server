import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";

const createSpecialties = async (req: Request) => {
    if (req.file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(req.file);
        req.body.icon = uploadToCloudinary?.secure_url;
    };

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};

const getAllSpecialties = async () => {
    const result = await prisma.specialties.findMany();
    const total = await prisma.specialties.count();

    return {
        meta: { total },
        data: result
    };
};

const deleteSpecialties = async (id: string) => {
    const result = await prisma.specialties.delete({
        where: { id },
    });

    return result;
};

export const SpecialtiesService = {
    createSpecialties,
    getAllSpecialties,
    deleteSpecialties
};