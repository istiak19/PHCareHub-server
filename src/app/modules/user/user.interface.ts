import { UserStatus } from "@prisma/client";

export interface IUser {
    name: string;
    email: string;
    password: string
};

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
};

export interface IStatus {
    status: UserStatus
};