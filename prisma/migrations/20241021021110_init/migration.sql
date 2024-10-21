-- CreateTable
CREATE TABLE "deletedAcc" (
    "id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "deletedAcc_id_key" ON "deletedAcc"("id");
