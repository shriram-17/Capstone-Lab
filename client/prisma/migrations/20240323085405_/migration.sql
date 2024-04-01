/*
  Warnings:

  - You are about to drop the column `url` on the `SqlFile` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "sqlFileId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_sqlFileId_fkey" FOREIGN KEY ("sqlFileId") REFERENCES "SqlFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SqlFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SqlFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SqlFile" ("createdAt", "fileName", "id", "result", "userId") SELECT "createdAt", "fileName", "id", "result", "userId" FROM "SqlFile";
DROP TABLE "SqlFile";
ALTER TABLE "new_SqlFile" RENAME TO "SqlFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
