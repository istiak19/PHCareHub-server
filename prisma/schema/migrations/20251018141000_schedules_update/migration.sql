/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `doctor_schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" DROP COLUMN "isBlocked",
ADD COLUMN     "isBook" BOOLEAN NOT NULL DEFAULT false;
