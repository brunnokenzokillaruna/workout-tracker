-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProfile" (
    "userId" TEXT NOT NULL,
    "gender" "Gender",
    "birthDate" DATE,
    "bodyWeightKg" DECIMAL(5,2),
    "experienceLevel" "ExperienceLevel",
    "preferredUnit" "WeightUnit" NOT NULL DEFAULT 'kg',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TrainingProfile" ADD CONSTRAINT "TrainingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
