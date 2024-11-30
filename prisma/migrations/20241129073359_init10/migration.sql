/*
  Warnings:

  - You are about to drop the `BookAuthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `BookAuthor`;

-- CreateTable
CREATE TABLE `book_author` (
    `book_id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,

    PRIMARY KEY (`book_id`, `author_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
