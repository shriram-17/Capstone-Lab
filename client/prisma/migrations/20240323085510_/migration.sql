/*
  Warnings:

  - You are about to drop the column `result` on the `SqlFile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SqlFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SqlFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SqlFile" ("createdAt", "fileName", "id", "userId") SELECT "createdAt", "fileName", "id", "userId" FROM "SqlFile";
DROP TABLE "SqlFile";
ALTER TABLE "new_SqlFile" RENAME TO "SqlFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
