/*
  Warnings:

  - The primary key for the `otpstore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `otpstore` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `otpstore` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "otpstore" DROP CONSTRAINT "otpstore_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "otpstore_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "otpstore_id_key" ON "otpstore"("id");
