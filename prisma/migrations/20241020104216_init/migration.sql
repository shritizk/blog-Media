-- CreateTable
CREATE TABLE "otpstore" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otpstore_pkey" PRIMARY KEY ("id")
);
