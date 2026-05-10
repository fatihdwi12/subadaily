-- CreateTable
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT 'More Than Just a Coffee Shop.',
    "intro1" TEXT NOT NULL DEFAULT '',
    "intro2" TEXT NOT NULL DEFAULT '',
    "stat1Number" TEXT NOT NULL DEFAULT '2019',
    "stat1Label" TEXT NOT NULL DEFAULT 'Tahun Berdiri',
    "stat2Number" TEXT NOT NULL DEFAULT '50+',
    "stat2Label" TEXT NOT NULL DEFAULT 'Menu Tersedia',
    "stat3Number" TEXT NOT NULL DEFAULT '10K+',
    "stat3Label" TEXT NOT NULL DEFAULT 'Pelanggan Setia',
    "stat4Number" TEXT NOT NULL DEFAULT '1',
    "stat4Label" TEXT NOT NULL DEFAULT 'Lokasi, Penuh Cinta',
    "photo1" TEXT,
    "photo2" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutValue_pkey" PRIMARY KEY ("id")
);
