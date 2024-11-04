/*
  Warnings:

  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectTitle]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectTitle` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectType` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_title_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "projectTitle" TEXT NOT NULL,
ADD COLUMN     "projectType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectTitle_key" ON "Project"("projectTitle");
