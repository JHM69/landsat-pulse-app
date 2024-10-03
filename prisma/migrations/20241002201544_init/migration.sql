-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'SMS', 'IN_APP');

-- CreateEnum
CREATE TYPE "ValidationResult" AS ENUM ('VALID', 'INVALID', 'PARTIALLY_VALID', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cloudCoverThreshold" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "notificationMethods" TEXT NOT NULL,
    "notificationLeadTime" INTEGER NOT NULL DEFAULT 1,
    "timeSpan" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandsatOverpass" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "satellite" TEXT NOT NULL,
    "path" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "cloudCover" DOUBLE PRECISION,
    "sceneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandsatOverpass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandsatData" (
    "id" SERIAL NOT NULL,
    "overpassId" INTEGER NOT NULL,
    "dataUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "srValues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandsatData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroundMeasurement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "measurements" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroundMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataValidation" (
    "id" SERIAL NOT NULL,
    "landsatDataId" INTEGER NOT NULL,
    "groundMeasurementId" INTEGER NOT NULL,
    "validatorId" INTEGER NOT NULL,
    "validationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validationResult" "ValidationResult" NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "landsatOverpassId" INTEGER,

    CONSTRAINT "DataValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "overpassId" INTEGER,
    "method" "NotificationMethod" NOT NULL,
    "leadTime" INTEGER NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "Location_latitude_longitude_idx" ON "Location"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "LandsatOverpass_datetime_idx" ON "LandsatOverpass"("datetime");

-- CreateIndex
CREATE UNIQUE INDEX "LandsatData_overpassId_key" ON "LandsatData"("overpassId");

-- CreateIndex
CREATE INDEX "GroundMeasurement_datetime_idx" ON "GroundMeasurement"("datetime");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandsatOverpass" ADD CONSTRAINT "LandsatOverpass_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandsatData" ADD CONSTRAINT "LandsatData_overpassId_fkey" FOREIGN KEY ("overpassId") REFERENCES "LandsatOverpass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundMeasurement" ADD CONSTRAINT "GroundMeasurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundMeasurement" ADD CONSTRAINT "GroundMeasurement_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataValidation" ADD CONSTRAINT "DataValidation_landsatDataId_fkey" FOREIGN KEY ("landsatDataId") REFERENCES "LandsatData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataValidation" ADD CONSTRAINT "DataValidation_groundMeasurementId_fkey" FOREIGN KEY ("groundMeasurementId") REFERENCES "GroundMeasurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataValidation" ADD CONSTRAINT "DataValidation_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataValidation" ADD CONSTRAINT "DataValidation_landsatOverpassId_fkey" FOREIGN KEY ("landsatOverpassId") REFERENCES "LandsatOverpass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_overpassId_fkey" FOREIGN KEY ("overpassId") REFERENCES "LandsatOverpass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
