/*
  Warnings:

  - You are about to drop the column `barangId` on the `peminjaman` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalpinjam` on the `peminjaman` table. All the data in the column will be lost.
  - Added the required column `borrowId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `peminjaman` DROP FOREIGN KEY `Peminjaman_barangId_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `barangId`,
    DROP COLUMN `tanggalpinjam`,
    ADD COLUMN `actualreturnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `borrowId` INTEGER NOT NULL,
    ADD COLUMN `itemId` INTEGER NOT NULL,
    ADD COLUMN `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Peminjaman` ADD CONSTRAINT `Peminjaman_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
