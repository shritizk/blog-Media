/*
  Warnings:

  - The primary key for the `loginRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `loginRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `loginRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "loginRecord" DROP CONSTRAINT "loginRecord_pkey",
DROP COLUMN "userId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "loginRecord_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "loginRecord_id_key" ON "loginRecord"("id");
