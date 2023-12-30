/*
  Warnings:

  - Added the required column `code` to the `RegistrationCode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegistrationCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uses" INTEGER DEFAULT 0,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RegistrationCode" ("createdAt", "id", "updatedAt", "uses") SELECT "createdAt", "id", "updatedAt", "uses" FROM "RegistrationCode";
DROP TABLE "RegistrationCode";
ALTER TABLE "new_RegistrationCode" RENAME TO "RegistrationCode";
CREATE UNIQUE INDEX "RegistrationCode_code_key" ON "RegistrationCode"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
