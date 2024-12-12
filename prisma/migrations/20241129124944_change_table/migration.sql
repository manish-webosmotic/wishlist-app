/*
  Warnings:

  - You are about to drop the column `customerData` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `productData` on the `Wishlist` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT,
    "customerName" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "shop" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Wishlist" ("createdAt", "id", "shop") SELECT "createdAt", "id", "shop" FROM "Wishlist";
DROP TABLE "Wishlist";
ALTER TABLE "new_Wishlist" RENAME TO "Wishlist";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
