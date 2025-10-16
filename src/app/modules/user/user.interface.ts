import { IDoctorSchedule } from "../doctorSchedule/doctorSchedule.interface";

export interface IUser {
    name: string;
    email: string;
    password: string
};

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}


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

export interface IDoctorUpdateInput {
    email: string;
    contactNumber: string;
    gender: Gender;
    appointmentFee: number;
    name: string;
    address: string;
    registrationNumber: string;
    experience: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
        isDeleted?: boolean;
    }[]
};