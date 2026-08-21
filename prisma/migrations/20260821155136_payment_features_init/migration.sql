/*
  Warnings:

  - You are about to drop the column `paymentReference` on the `Orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Orders_paymentReference_key";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "paymentReference",
ADD COLUMN     "reference" TEXT;

-- CreateTable
CREATE TABLE "PendingPayment" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "StreetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingPayment_reference_key" ON "PendingPayment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_reference_key" ON "Orders"("reference");
