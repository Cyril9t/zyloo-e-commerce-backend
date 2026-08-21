/*
  Warnings:

  - You are about to alter the column `total` on the `PendingPayment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "PendingPayment" ALTER COLUMN "total" SET DATA TYPE INTEGER;
