/*
  Warnings:

  - You are about to drop the column `dataMomento` on the `Fotos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fotos" DROP COLUMN "dataMomento",
ADD COLUMN     "datafoto" TIMESTAMP(3);
