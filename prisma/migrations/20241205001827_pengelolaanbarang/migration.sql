/*
  Warnings:

  - You are about to drop the column `actualreturnDate` on the `peminjaman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `peminjaman` DROP COLUMN `actualreturnDate`;

-- CreateTable
CREATE TABLE `Pengembalian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peminjamanId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `actualreturnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pengembalian_peminjamanId_key`(`peminjamanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_peminjamanId_fkey` FOREIGN KEY (`peminjamanId`) REFERENCES `Peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengembalian` ADD CONSTRAINT `Pengembalian_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
