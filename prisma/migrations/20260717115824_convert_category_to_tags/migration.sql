/*
  Warnings:

  - You are about to drop the column `category` on the `Photo` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PhotoToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PhotoToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PhotoToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- DataMigration: seed the fixed tag set that replaces the old category enum
INSERT INTO "Tag" ("id", "name") VALUES
  (lower(hex(randomblob(16))), 'Electric'),
  (lower(hex(randomblob(16))), 'Diesel'),
  (lower(hex(randomblob(16))), 'Heritage'),
  (lower(hex(randomblob(16))), 'Metros'),
  (lower(hex(randomblob(16))), 'Trams'),
  (lower(hex(randomblob(16))), 'Stations'),
  (lower(hex(randomblob(16))), 'Infrastructure'),
  (lower(hex(randomblob(16))), 'Other');

-- DataMigration: carry each photo's old single category over as a tag
INSERT INTO "_PhotoToTag" ("A", "B")
SELECT "Photo"."id", "Tag"."id" FROM "Photo"
JOIN "Tag" ON "Tag"."name" = "Photo"."category";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "operator" TEXT,
    "trainLine" TEXT,
    "trainType" TEXT,
    "consist" TEXT,
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
INSERT INTO "new_Photo" ("camera", "consist", "createdAt", "dateTaken", "description", "id", "imageUrl", "locationDetail", "operator", "photographerId", "state", "station", "status", "suburb", "title", "trainLine", "trainType") SELECT "camera", "consist", "createdAt", "dateTaken", "description", "id", "imageUrl", "locationDetail", "operator", "photographerId", "state", "station", "status", "suburb", "title", "trainLine", "trainType" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PhotoToTag_AB_unique" ON "_PhotoToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PhotoToTag_B_index" ON "_PhotoToTag"("B");
