-- CreateTable
CREATE TABLE "ExerciseAvoidance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "reason" "AvoidanceReason" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseAvoidance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteExercise" (
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteExercise_pkey" PRIMARY KEY ("userId","exerciseId")
);

-- CreateTable
CREATE TABLE "FavoriteTemplate" (
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteTemplate_pkey" PRIMARY KEY ("userId","templateId")
);

-- CreateIndex
CREATE INDEX "ExerciseAvoidance_userId_idx" ON "ExerciseAvoidance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseAvoidance_userId_exerciseId_key" ON "ExerciseAvoidance"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "ExerciseAvoidance" ADD CONSTRAINT "ExerciseAvoidance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAvoidance" ADD CONSTRAINT "ExerciseAvoidance_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteExercise" ADD CONSTRAINT "FavoriteExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteExercise" ADD CONSTRAINT "FavoriteExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTemplate" ADD CONSTRAINT "FavoriteTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTemplate" ADD CONSTRAINT "FavoriteTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkoutTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
