/*
  Warnings:

  - You are about to drop the `_AuthorToBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_AuthorToBook` DROP FOREIGN KEY `_AuthorToBook_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AuthorToBook` DROP FOREIGN KEY `_AuthorToBook_B_fkey`;

-- DropTable
DROP TABLE `_AuthorToBook`;

-- CreateTable
CREATE TABLE `BookAuthor` (
    `book_id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,

    PRIMARY KEY (`book_id`, `author_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
