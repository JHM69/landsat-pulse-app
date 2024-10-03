-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "geojson" JSONB;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "notifyBefore" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "notifyIn" TEXT NOT NULL DEFAULT 'EMAIL,SMS,IN_APP, ALL',
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smsNumber" TEXT,
ADD COLUMN     "stelite" TEXT;

-- CreateTable
CREATE TABLE "_LocationToNotification" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToNotification_AB_unique" ON "_LocationToNotification"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToNotification_B_index" ON "_LocationToNotification"("B");

-- CreateIndex
CREATE INDEX "Location_userId_idx" ON "Location"("userId");

-- AddForeignKey
ALTER TABLE "_LocationToNotification" ADD CONSTRAINT "_LocationToNotification_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToNotification" ADD CONSTRAINT "_LocationToNotification_B_fkey" FOREIGN KEY ("B") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
