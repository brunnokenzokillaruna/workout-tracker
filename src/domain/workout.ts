import { fail, ok, type ValidationResult } from "@/domain/validation";

/** Rule 10 — finishedAt cannot precede startedAt. */
export function validateWorkoutDates(
  startedAt: Date,
  finishedAt: Date | null,
): ValidationResult {
  if (finishedAt != null && finishedAt.getTime() < startedAt.getTime()) {
    return fail("finishedAt cannot be before startedAt");
  }
  return ok();
}

/**
 * Rule 11 — at most one unfinished workout per user.
 * Pass whether another unfinished workout already exists (from a DB query).
 */
export function validateSingleOpenWorkout(
  hasOtherUnfinished: boolean,
): ValidationResult {
  if (hasOtherUnfinished) {
    return fail("Only one unfinished workout is allowed per user");
  }
  return ok();
}
