/*
  Warnings:

  - You are about to drop the column `book_id` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Author` DROP COLUMN `book_id`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `author_id`;

-- CreateTable
CREATE TABLE `_AuthorToBook` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AuthorToBook_AB_unique`(`A`, `B`),
    INDEX `_AuthorToBook_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Author_name_key` ON `Author`(`name`);

-- AddForeignKey
ALTER TABLE `_AuthorToBook` ADD CONSTRAINT `_AuthorToBook_A_fkey` FOREIGN KEY (`A`) REFERENCES `Author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AuthorToBook` ADD CONSTRAINT `_AuthorToBook_B_fkey` FOREIGN KEY (`B`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
