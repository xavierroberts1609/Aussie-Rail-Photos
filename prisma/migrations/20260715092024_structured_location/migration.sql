/*
  Warnings:

  - You are about to drop the column `location` on the `Photo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "trainLine" TEXT,
    "trainType" TEXT,
    "state" TEXT,
    "suburb" TEXT,
    "station" TEXT,
    "locationDetail" TEXT,
    "camera" TEXT,
    "dateTaken" DATETIME,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photographerId" TEXT NOT NULL,
    CONSTRAINT "Photo_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("camera", "category", "createdAt", "dateTaken", "description", "id", "imageUrl", "photographerId", "status", "title", "trainLine", "trainType") SELECT "camera", "category", "createdAt", "dateTaken", "description", "id", "imageUrl", "photographerId", "status", "title", "trainLine", "trainType" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
