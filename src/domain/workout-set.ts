import type {
  IntensityTechnique,
  TrackingMode,
  WeightEntryMode,
  WeightUnit,
} from "@/generated/prisma/enums";
import { combine, fail, ok, type ValidationResult } from "@/domain/validation";
import { canonicalWeightKg, weightsEqual } from "@/domain/weight";

export type SetStageInput = {
  id: string;
  parentSetId: string | null;
  workoutExerciseId: string;
  stageIndex: number;
  setNumber: number | null;
  technique: IntensityTechnique | null;
  intraRestSeconds: number | null;
  weightKg: number | null;
  enteredWeight: number | null;
  enteredUnit: WeightUnit | null;
  weightEntryMode: WeightEntryMode | null;
  reps: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
  rpe: number | null;
  isCompleted: boolean;
};

/** Rule 1 — parent vs stage field ownership. */
export function validateParentStageFields(set: SetStageInput): ValidationResult {
  const isStage = set.parentSetId != null;

  if (isStage) {
    const errors: string[] = [];
    if (set.technique != null) {
      errors.push("Stages must not carry technique (belongs on the parent)");
    }
    if (set.setNumber != null) {
      errors.push("Stages must not carry setNumber (belongs on the parent)");
    }
    return errors.length ? fail(...errors) : ok();
  }

  if (set.intraRestSeconds != null) {
    return fail("intraRestSeconds is only valid on stages, not on parent sets");
  }
  return ok();
}

/** Rules 2–4 — stage graph shape for one parent and its children. */
export function validateStageGraph(
  parent: SetStageInput,
  stages: SetStageInput[],
): ValidationResult {
  if (parent.parentSetId != null) {
    return fail("Parent set must have parentSetId null");
  }

  const errors: string[] = [];

  for (const stage of stages) {
    if (stage.parentSetId !== parent.id) {
      errors.push(`Stage ${stage.id} parentSetId must point at parent ${parent.id}`);
    }
    if (stage.workoutExerciseId !== parent.workoutExerciseId) {
      errors.push(`Stage ${stage.id} must share workoutExerciseId with its parent`);
    }
  }

  const indexes = stages.map((s) => s.stageIndex).sort((a, b) => a - b);
  for (let i = 0; i < indexes.length; i++) {
    if (indexes[i] !== i + 1) {
      errors.push("stageIndex must be unique per parent and contiguous from 1");
      break;
    }
  }

  const unique = new Set(stages.map((s) => s.stageIndex));
  if (unique.size !== stages.length) {
    errors.push("stageIndex must be unique per parent");
  }

  return errors.length ? fail(...errors) : ok();
}

/** Rule 5 — technique vs number of stages. */
export function validateTechniqueStages(
  technique: IntensityTechnique | null,
  stageCount: number,
): ValidationResult {
  const tech = technique ?? "standard";
  if (tech === "standard" && stageCount > 0) {
    return fail("technique standard must have zero stages");
  }
  if (tech !== "standard" && stageCount < 1) {
    return fail(`technique ${tech} should have at least one stage`);
  }
  return ok();
}

/** Rule 6 — required columns for a completed set given tracking mode. */
export function validateTrackingFields(
  mode: TrackingMode,
  set: Pick<
    SetStageInput,
    "weightKg" | "reps" | "durationSeconds" | "distanceMeters" | "isCompleted"
  >,
): ValidationResult {
  if (!set.isCompleted) return ok();

  switch (mode) {
    case "reps_weight":
      if (set.weightKg == null || set.reps == null) {
        return fail("reps_weight requires weightKg and reps when completed");
      }
      break;
    case "reps_only":
      if (set.reps == null) {
        return fail("reps_only requires reps when completed");
      }
      break;
    case "time":
      if (set.durationSeconds == null) {
        return fail("time requires durationSeconds when completed");
      }
      break;
    case "distance":
      if (set.distanceMeters == null) {
        return fail("distance requires distanceMeters when completed");
      }
      break;
    case "time_distance":
      if (set.durationSeconds == null || set.distanceMeters == null) {
        return fail("time_distance requires durationSeconds and distanceMeters when completed");
      }
      break;
  }
  return ok();
}

/** Rule 7 — numeric bounds. */
export function validateNumericBounds(set: SetStageInput): ValidationResult {
  const errors: string[] = [];
  if (set.weightKg != null && set.weightKg < 0) {
    errors.push("weightKg must be >= 0");
  }
  if (set.reps != null && set.reps < 1) {
    errors.push("reps must be >= 1");
  }
  if (set.rpe != null && (set.rpe < 1 || set.rpe > 10)) {
    errors.push("rpe must be between 1 and 10");
  }
  return errors.length ? fail(...errors) : ok();
}

/** Rule 8 — canonical weight matches entered values. */
export function validateCanonicalWeight(set: SetStageInput): ValidationResult {
  if (
    set.enteredWeight == null ||
    set.enteredUnit == null ||
    set.weightEntryMode == null ||
    set.weightKg == null
  ) {
    return ok();
  }

  const expected = canonicalWeightKg(
    set.enteredWeight,
    set.enteredUnit,
    set.weightEntryMode,
  );
  if (!weightsEqual(set.weightKg, expected)) {
    return fail(
      `weightKg ${set.weightKg} does not match entered ${set.enteredWeight} ${set.enteredUnit} (${set.weightEntryMode}); expected ${expected}`,
    );
  }
  return ok();
}

/** Validate one set row in isolation (rules 1, 6 partial, 7, 8). */
export function validateSetRow(
  set: SetStageInput,
  trackingMode: TrackingMode,
): ValidationResult {
  return combine(
    validateParentStageFields(set),
    validateTrackingFields(trackingMode, set),
    validateNumericBounds(set),
    validateCanonicalWeight(set),
  );
}

/** Validate a parent set together with its stages (rules 1–8). */
export function validateSetFamily(
  parent: SetStageInput,
  stages: SetStageInput[],
  trackingMode: TrackingMode,
): ValidationResult {
  return combine(
    validateSetRow(parent, trackingMode),
    ...stages.map((s) => validateSetRow(s, trackingMode)),
    validateStageGraph(parent, stages),
    validateTechniqueStages(parent.technique, stages.length),
  );
}
