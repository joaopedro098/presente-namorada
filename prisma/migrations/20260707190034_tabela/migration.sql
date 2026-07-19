-- CreateTable
CREATE TABLE "Memorias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Memorias_pkey" PRIMARY KEY ("id")
);
