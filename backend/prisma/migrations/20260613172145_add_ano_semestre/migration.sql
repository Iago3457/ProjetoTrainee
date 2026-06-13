/*
  Warnings:

  - A unique constraint covering the columns `[alunoId,disciplinaID,semestre,ano]` on the table `Matricula` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ano` to the `Matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semestre` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Matricula_alunoId_disciplinaID_key";

-- AlterTable
ALTER TABLE "Matricula" ADD COLUMN     "ano" INTEGER NOT NULL,
ADD COLUMN     "semestre" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_alunoId_disciplinaID_semestre_ano_key" ON "Matricula"("alunoId", "disciplinaID", "semestre", "ano");
