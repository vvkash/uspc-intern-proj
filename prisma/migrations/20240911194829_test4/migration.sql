/*
  Warnings:

  - You are about to drop the `NFLTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NFLTeam";

-- CreateTable
CREATE TABLE "NFLTeams" (
    "id" SERIAL NOT NULL,
    "teamID" TEXT NOT NULL,
    "teamAbv" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "teamCity" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,
    "loss" INTEGER NOT NULL,
    "tie" INTEGER NOT NULL,
    "division" TEXT NOT NULL,
    "conferenceAbv" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "pf" INTEGER NOT NULL,
    "pa" INTEGER NOT NULL,
    "nflComLogo1" TEXT NOT NULL,
    "espnLogo1" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFLTeams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFLTeams_teamID_key" ON "NFLTeams"("teamID");
