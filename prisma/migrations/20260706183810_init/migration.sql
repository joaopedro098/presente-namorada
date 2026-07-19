-- CreateTable
CREATE TABLE "Fotos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT,
    "descricao" TEXT,
    "imageUrl" TEXT NOT NULL,
    "dataMomento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fotos_pkey" PRIMARY KEY ("id")
);
