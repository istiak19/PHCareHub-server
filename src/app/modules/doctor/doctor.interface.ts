import { IDoctorSchedule } from "../doctorSchedule/doctorSchedule.interface";
import { Gender, IUser } from "../user/user.interface";

export interface IDoctor {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    user: IUser;
    doctorSchedules?: IDoctorSchedule[];
};

export type IDoctorFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNumber?: string | undefined;
    gender?: string | undefined;
    specialties?: string | undefined;
};

export type IDoctorUpdate = {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: "MALE" | "FEMALE";
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
    // NEW: Simplified specialty management
    specialties?: string[]; // Array of specialty IDs to add
    removeSpecialties?: string[]; // Array of specialty IDs to remove
};

export type ISpecialties = {
    specialtiesId: string;
    isDeleted?: null;
};