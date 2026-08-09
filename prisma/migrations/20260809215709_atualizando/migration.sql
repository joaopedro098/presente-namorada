/*
  Warnings:

  - Added the required column `destinatario` to the `carta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remetente` to the `carta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carta" ADD COLUMN     "destinatario" TEXT NOT NULL,
ADD COLUMN     "remetente" TEXT NOT NULL;
