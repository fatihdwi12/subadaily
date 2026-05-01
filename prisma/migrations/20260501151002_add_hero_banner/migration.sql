-- CreateTable
CREATE TABLE "HeroBanner" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroBanner_pkey" PRIMARY KEY ("id")
);
