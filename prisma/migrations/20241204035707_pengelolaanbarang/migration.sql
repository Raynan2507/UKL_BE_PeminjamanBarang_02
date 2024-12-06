/*
  Warnings:

  - You are about to drop the column `description` on the `barang` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah` on the `barang` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `barang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `barang` DROP COLUMN `description`,
    DROP COLUMN `jumlah`,
    DROP COLUMN `userId`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `location` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0;
