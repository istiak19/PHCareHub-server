import { IDoctor } from "../doctor/doctor.interface";
import { ISchedule } from "../schedule/schedule.interface";

export interface IDoctorSchedule {
    doctorId: string;
    doctor: IDoctor;
    scheduleId: string;
    schedule: ISchedule;
    isBook?: boolean;
};