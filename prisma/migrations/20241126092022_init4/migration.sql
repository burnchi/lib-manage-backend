/*
  Warnings:

  - You are about to alter the column `author_id` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `author_id` INTEGER NOT NULL;
