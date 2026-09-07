import type {
  Equipment,
  MuscleEmphasis,
  MuscleGroup,
  TrackingMode,
  UserRole,
} from "@/generated/prisma/enums";
import {
  Equipment as EquipmentEnum,
  IntensityTechnique as IntensityTechniqueEnum,
  MediaProvider as MediaProviderEnum,
  MuscleEmphasis as MuscleEmphasisEnum,
  MuscleGroup as MuscleGroupEnum,
  TrackingMode as TrackingModeEnum,
} from "@/generated/prisma/enums";
import { combine, fail, ok, type ValidationResult } from "@/domain/validation";

/** Rule 12 — custom exercise only usable by its owner. */
export function validateCustomExerciseAccess(
  exerciseOwnerId: string | null,
  actorUserId: string,
): ValidationResult {
  if (exerciseOwnerId == null) return ok();
  if (exerciseOwnerId !== actorUserId) {
    return fail("A custom exercise may only be referenced by its owner");
  }
  return ok();
}

/** Rule 13 — only curators write global catalog rows or set isVerified. */
export function validateCuratorCatalogWrite(
  role: UserRole,
  ownerId: string | null,
  settingVerified: boolean,
): ValidationResult {
  if (ownerId == null || settingVerified) {
    if (role !== "curator") {
      return fail("Only a curator may create/modify global exercises or set isVerified");
    }
  }
  return ok();
}

export type VerifiedExerciseFields = {
  isVerified: boolean;
  primaryEmphasis: MuscleEmphasis[];
  secondaryEmphasis: MuscleEmphasis[];
  primaryMuscle: MuscleGroup | null;
  equipment: Equipment | null;
  trackingMode: TrackingMode | null;
  verifiedById: string | null;
  verifiedAt: Date | null;
};

/** Rules 14, 14a — verification gate and emphasis list shape. */
export function validateVerifiedExercise(fields: VerifiedExerciseFields): ValidationResult {
  if (!fields.isVerified) {
    return validateEmphasisLists(fields.primaryEmphasis, fields.secondaryEmphasis);
  }

  const errors: string[] = [];
  if (fields.primaryEmphasis.length === 0) {
    errors.push("isVerified requires non-empty primaryEmphasis");
  }
  if (fields.primaryMuscle == null) {
    errors.push("isVerified requires primaryMuscle");
  }
  if (fields.equipment == null) {
    errors.push("isVerified requires equipment");
  }
  if (fields.trackingMode == null) {
    errors.push("isVerified requires trackingMode");
  }
  if (fields.verifiedById == null) {
    errors.push("isVerified requires verifiedById");
  }
  if (fields.verifiedAt == null) {
    errors.push("isVerified requires verifiedAt");
  }

  return combine(
    errors.length ? fail(...errors) : ok(),
    validateEmphasisLists(fields.primaryEmphasis, fields.secondaryEmphasis),
  );
}

/** Rule 14a — 1–3 primary values; no overlap with secondary. */
export function validateEmphasisLists(
  primary: MuscleEmphasis[],
  secondary: MuscleEmphasis[],
): ValidationResult {
  const errors: string[] = [];
  if (primary.length > 3) {
    errors.push("primaryEmphasis must hold at most 3 values");
  }
  const primarySet = new Set(primary);
  for (const value of secondary) {
    if (primarySet.has(value)) {
      errors.push(`emphasis ${value} cannot appear in both primary and secondary`);
    }
  }
  return errors.length ? fail(...errors) : ok();
}

const ENUM_TABLES: Record<string, Record<string, string>> = {
  MuscleEmphasis: MuscleEmphasisEnum,
  MuscleGroup: MuscleGroupEnum,
  Equipment: EquipmentEnum,
  TrackingMode: TrackingModeEnum,
  IntensityTechnique: IntensityTechniqueEnum,
  MediaProvider: MediaProviderEnum,
};

/** Rule 15 — reject unknown enum strings; never coerce. */
export function validateEnumValue(
  enumName: keyof typeof ENUM_TABLES,
  value: string,
): ValidationResult {
  const table = ENUM_TABLES[enumName];
  if (!Object.values(table).includes(value)) {
    return fail(`Invalid ${enumName} value: ${value}`);
  }
  return ok();
}

export function validateEnumList(
  enumName: keyof typeof ENUM_TABLES,
  values: string[],
): ValidationResult {
  return combine(...values.map((v) => validateEnumValue(enumName, v)));
}

export type NameIndex = {
  name: string;
  namePtBr: string | null;
  searchAliases: string[];
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Rule 16 — exact normalized collision against name / namePtBr / aliases. */
export function findDuplicateExerciseName(
  candidate: { name: string; namePtBr?: string | null; searchAliases?: string[] },
  existing: NameIndex[],
): string | null {
  const candidates = [
    candidate.name,
    candidate.namePtBr,
    ...(candidate.searchAliases ?? []),
  ]
    .filter((s): s is string => Boolean(s && s.trim()))
    .map(normalize);

  for (const row of existing) {
    const pool = [row.name, row.namePtBr, ...row.searchAliases]
      .filter((s): s is string => Boolean(s && s.trim()))
      .map(normalize);
    for (const c of candidates) {
      if (pool.includes(c)) {
        return row.name;
      }
    }
  }
  return null;
}

export function validateNewExerciseName(
  candidate: { name: string; namePtBr?: string | null; searchAliases?: string[] },
  existing: NameIndex[],
): ValidationResult {
  const hit = findDuplicateExerciseName(candidate, existing);
  if (hit) {
    return fail(`Exercise name collides with existing exercise "${hit}"`);
  }
  return ok();
}
