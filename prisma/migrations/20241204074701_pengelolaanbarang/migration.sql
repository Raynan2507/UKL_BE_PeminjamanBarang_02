/*
  Warnings:

  - You are about to drop the column `borrowId` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `borrowId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('Admin', 'User') NOT NULL;
