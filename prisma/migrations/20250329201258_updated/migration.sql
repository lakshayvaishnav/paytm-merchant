-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchantAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "locked" INTEGER NOT NULL DEFAULT 0,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "merchantAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_userId_key" ON "UserAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "merchantAccount_merchantId_key" ON "merchantAccount"("merchantId");

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchantAccount" ADD CONSTRAINT "merchantAccount_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
