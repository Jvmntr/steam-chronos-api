-- CreateTable
CREATE TABLE "SyncLog" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "gamesFound" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);
