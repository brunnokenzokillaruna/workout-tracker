-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('barbell', 'dumbbell', 'machine', 'cable', 'smith_machine', 'bodyweight', 'kettlebell', 'band', 'other');

-- CreateEnum
CREATE TYPE "TrackingMode" AS ENUM ('reps_weight', 'reps_only', 'time', 'distance', 'time_distance');

-- CreateEnum
CREATE TYPE "IntensityTechnique" AS ENUM ('standard', 'drop_set', 'rest_pause', 'cluster', 'myo_reps');

-- CreateEnum
CREATE TYPE "MediaProvider" AS ENUM ('youtube', 'instagram', 'other');

-- CreateEnum
CREATE TYPE "WeightEntryMode" AS ENUM ('total', 'per_side');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('kg', 'lb');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('member', 'curator');

-- CreateEnum
CREATE TYPE "ExerciseDataSource" AS ENUM ('ai_assisted', 'manual');

-- CreateEnum
CREATE TYPE "AvoidanceReason" AS ENUM ('injury', 'dislike');

-- CreateEnum
CREATE TYPE "TemplateSource" AS ENUM ('manual', 'ai_generated');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'lower_back', 'neck', 'full_body');

-- CreateEnum
CREATE TYPE "MuscleEmphasis" AS ENUM ('chest_upper', 'chest_mid', 'chest_lower', 'deltoid_anterior', 'deltoid_lateral', 'deltoid_posterior', 'lat', 'trap_upper', 'trap_mid', 'trap_lower', 'rhomboid', 'biceps_long_head', 'biceps_short_head', 'brachialis', 'triceps_long_head', 'triceps_lateral_head', 'quad_vastus_lateralis', 'quad_vastus_medialis', 'quad_rectus_femoris', 'hamstring_biceps_femoris', 'hamstring_medial', 'glute_max', 'glute_med', 'calf_gastrocnemius', 'calf_soleus', 'abs_upper', 'abs_lower', 'obliques', 'erector_spinae');
