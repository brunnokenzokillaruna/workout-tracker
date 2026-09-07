import { describe, expect, it } from "vitest";
import {
  validateCuratorCatalogWrite,
  validateCustomExerciseAccess,
  validateEnumValue,
  validateNewExerciseName,
  validateVerifiedExercise,
} from "@/domain/exercise";
import { validateMediaUrl } from "@/domain/media-url";
import { validateSingleOpenWorkout, validateWorkoutDates } from "@/domain/workout";

describe("workout session rules", () => {
  it("rejects finishedAt before startedAt (rule 10)", () => {
    const started = new Date("2026-01-02T12:00:00Z");
    const finished = new Date("2026-01-01T12:00:00Z");
    expect(validateWorkoutDates(started, finished).ok).toBe(false);
  });

  it("blocks a second open workout (rule 11)", () => {
    expect(validateSingleOpenWorkout(true).ok).toBe(false);
    expect(validateSingleOpenWorkout(false).ok).toBe(true);
  });
});

describe("exercise catalog rules", () => {
  it("restricts custom exercises to owner (rule 12)", () => {
    expect(validateCustomExerciseAccess("user-a", "user-b").ok).toBe(false);
    expect(validateCustomExerciseAccess("user-a", "user-a").ok).toBe(true);
    expect(validateCustomExerciseAccess(null, "user-a").ok).toBe(true);
  });

  it("requires curator for global writes (rule 13)", () => {
    expect(validateCuratorCatalogWrite("member", null, false).ok).toBe(false);
    expect(validateCuratorCatalogWrite("curator", null, false).ok).toBe(true);
    expect(validateCuratorCatalogWrite("member", "user-a", true).ok).toBe(false);
  });

  it("requires fields when isVerified (rule 14 / 14a)", () => {
    const incomplete = validateVerifiedExercise({
      isVerified: true,
      primaryEmphasis: [],
      secondaryEmphasis: [],
      primaryMuscle: "chest",
      equipment: "barbell",
      trackingMode: "reps_weight",
      verifiedById: null,
      verifiedAt: null,
    });
    expect(incomplete.ok).toBe(false);

    const overlap = validateVerifiedExercise({
      isVerified: true,
      primaryEmphasis: ["chest_mid"],
      secondaryEmphasis: ["chest_mid"],
      primaryMuscle: "chest",
      equipment: "barbell",
      trackingMode: "reps_weight",
      verifiedById: "curator-1",
      verifiedAt: new Date(),
    });
    expect(overlap.ok).toBe(false);
  });

  it("rejects invented enum values (rule 15)", () => {
    expect(validateEnumValue("MuscleEmphasis", "deltoid_side").ok).toBe(false);
    expect(validateEnumValue("MuscleEmphasis", "deltoid_lateral").ok).toBe(true);
  });

  it("detects duplicate names across languages (rule 16)", () => {
    const existing = [
      {
        name: "Bench Press",
        namePtBr: "Supino reto",
        searchAliases: ["peito barra"],
      },
    ];
    expect(
      validateNewExerciseName({ name: "supino reto" }, existing).ok,
    ).toBe(false);
    expect(
      validateNewExerciseName({ name: "Incline Dumbbell Press" }, existing).ok,
    ).toBe(true);
  });
});

describe("media URL", () => {
  it("allows https youtube hosts", () => {
    expect(
      validateMediaUrl("https://www.youtube.com/watch?v=abc", "youtube").ok,
    ).toBe(true);
  });

  it("rejects javascript: and http", () => {
    expect(validateMediaUrl("javascript:alert(1)", "other").ok).toBe(false);
    expect(validateMediaUrl("http://instagram.com/p/x", "instagram").ok).toBe(
      false,
    );
  });
});
