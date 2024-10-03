/*
  Warnings:

  - You are about to drop the column `method` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `stelite` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "method",
DROP COLUMN "stelite",
ADD COLUMN     "satellite" TEXT,
ALTER COLUMN "leadTime" DROP NOT NULL;
