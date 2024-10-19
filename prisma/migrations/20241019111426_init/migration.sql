-- CreateTable
CREATE TABLE "loginRecord" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "loginRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loginRecord_email_key" ON "loginRecord"("email");

-- CreateIndex
CREATE UNIQUE INDEX "loginRecord_token_key" ON "loginRecord"("token");
