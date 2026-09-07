-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "namePtBr" TEXT,
    "searchAliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryMuscle" "MuscleGroup" NOT NULL,
    "primaryEmphasis" "MuscleEmphasis"[] DEFAULT ARRAY[]::"MuscleEmphasis"[],
    "secondaryEmphasis" "MuscleEmphasis"[] DEFAULT ARRAY[]::"MuscleEmphasis"[],
    "emphasisRationale" TEXT,
    "equipment" "Equipment" NOT NULL,
    "trackingMode" "TrackingMode" NOT NULL,
    "formCues" TEXT,
    "dataSource" "ExerciseDataSource" NOT NULL,
    "wasGrounded" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseMedia" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "provider" "MediaProvider" NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "addedById" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "isBroken" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExerciseMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercise_ownerId_idx" ON "Exercise"("ownerId");

-- CreateIndex
CREATE INDEX "Exercise_primaryMuscle_idx" ON "Exercise"("primaryMuscle");

-- CreateIndex
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");

-- CreateIndex
CREATE INDEX "Exercise_isVerified_idx" ON "Exercise"("isVerified");

-- CreateIndex
CREATE INDEX "Exercise_primaryEmphasis_idx" ON "Exercise" USING GIN ("primaryEmphasis");

-- CreateIndex
CREATE INDEX "Exercise_secondaryEmphasis_idx" ON "Exercise" USING GIN ("secondaryEmphasis");

-- CreateIndex
CREATE INDEX "ExerciseMedia_exerciseId_idx" ON "ExerciseMedia"("exerciseId");

-- CreateIndex
CREATE INDEX "ExerciseMedia_provider_idx" ON "ExerciseMedia"("provider");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMedia" ADD CONSTRAINT "ExerciseMedia_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMedia" ADD CONSTRAINT "ExerciseMedia_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
