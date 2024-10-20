/*
  Warnings:

  - You are about to drop the column `email` on the `loginRecord` table. All the data in the column will be lost.
  - Added the required column `userId` to the `loginRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "loginRecord_email_key";

-- AlterTable
ALTER TABLE "loginRecord" DROP COLUMN "email",
ADD COLUMN     "userId" INTEGER NOT NULL;

