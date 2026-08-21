/*
  Warnings:

  - A unique constraint covering the columns `[paymentReference]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "paymentReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Orders_paymentReference_key" ON "Orders"("paymentReference");
