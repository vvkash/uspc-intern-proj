/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamAbv]` on the table `nfl` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "nfl_teamAbv_key" ON "nfl"("teamAbv");
