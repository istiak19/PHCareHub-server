import { ISchedule } from "../schedule/schedule.interface";
import { IDoctor } from "../user/user.interface";

export interface IDoctorSchedule {
    doctorId: string;
    doctor: IDoctor;
    scheduleId: string;
    schedule: ISchedule;
    isBlocked?: boolean;
};