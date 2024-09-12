-- CreateTable
CREATE TABLE "nfl" (
    "id" SERIAL NOT NULL,
    "teamAbv" TEXT NOT NULL,
    "teamCity" TEXT NOT NULL,
    "loss" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "nfl_pkey" PRIMARY KEY ("id")
);
