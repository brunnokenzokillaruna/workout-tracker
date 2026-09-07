import { describe, expect, it } from "vitest";
import {
  validateCanonicalWeight,
  validateParentStageFields,
  validateSetFamily,
  validateStageGraph,
  validateTechniqueStages,
  type SetStageInput,
} from "@/domain/workout-set";

function baseSet(overrides: Partial<SetStageInput> = {}): SetStageInput {
  return {
    id: "parent-1",
    parentSetId: null,
    workoutExerciseId: "we-1",
    stageIndex: 0,
    setNumber: 1,
    technique: "standard",
    intraRestSeconds: null,
    weightKg: 50,
    enteredWeight: 50,
    enteredUnit: "kg",
    weightEntryMode: "total",
    reps: 8,
    durationSeconds: null,
    distanceMeters: null,
    rpe: null,
    isCompleted: true,
    ...overrides,
  };
}

describe("workout set rules", () => {
  it("rejects technique on a stage (rule 1)", () => {
    const stage = baseSet({
      id: "s1",
      parentSetId: "parent-1",
      stageIndex: 1,
      setNumber: null,
      technique: "drop_set",
      intraRestSeconds: 0,
    });
    const result = validateParentStageFields(stage);
    expect(result.ok).toBe(false);
  });

  it("rejects intraRestSeconds on a parent (rule 1)", () => {
    const result = validateParentStageFields(
      baseSet({ intraRestSeconds: 10 }),
    );
    expect(result.ok).toBe(false);
  });

  it("rejects chained stages (rule 2)", () => {
    const parent = baseSet();
    const mid = baseSet({
      id: "mid",
      parentSetId: parent.id,
      stageIndex: 1,
      setNumber: null,
      technique: null,
    });
    // Treating mid as parent of another stage would be wrong; graph check
    // ensures children point at a true parent (parentSetId null).
    const result = validateStageGraph(mid, []);
    expect(result.ok).toBe(false);
  });

  it("requires contiguous stageIndex from 1 (rule 4)", () => {
    const parent = baseSet({ technique: "drop_set" });
    const stages = [
      baseSet({
        id: "a",
        parentSetId: parent.id,
        stageIndex: 1,
        setNumber: null,
        technique: null,
        weightKg: 30,
        enteredWeight: 30,
      }),
      baseSet({
        id: "b",
        parentSetId: parent.id,
        stageIndex: 3,
        setNumber: null,
        technique: null,
        weightKg: 20,
        enteredWeight: 20,
      }),
    ];
    expect(validateStageGraph(parent, stages).ok).toBe(false);
  });

  it("counts sets via parent-only; drop family validates (rules 5 + example)", () => {
    const parent = baseSet({
      id: "2",
      setNumber: 2,
      technique: "drop_set",
      weightKg: 40,
      enteredWeight: 40,
      reps: 10,
    });
    const stages = [
      baseSet({
        id: "3",
        parentSetId: "2",
        stageIndex: 1,
        setNumber: null,
        technique: null,
        weightKg: 30,
        enteredWeight: 30,
        reps: 6,
        intraRestSeconds: 0,
      }),
      baseSet({
        id: "4",
        parentSetId: "2",
        stageIndex: 2,
        setNumber: null,
        technique: null,
        weightKg: 20,
        enteredWeight: 20,
        reps: 5,
        intraRestSeconds: 0,
      }),
    ];

    const parentsOnly = [baseSet({ id: "1" }), parent].filter(
      (s) => s.parentSetId == null,
    );
    expect(parentsOnly).toHaveLength(2);

    expect(validateSetFamily(parent, stages, "reps_weight").ok).toBe(true);
  });

  it("rejects standard with stages (rule 5)", () => {
    expect(validateTechniqueStages("standard", 1).ok).toBe(false);
  });

  it("asserts canonical weight matches entry (rule 8)", () => {
    const bad = baseSet({
      enteredWeight: 45,
      enteredUnit: "lb",
      weightEntryMode: "total",
      weightKg: 45,
    });
    expect(validateCanonicalWeight(bad).ok).toBe(false);

    const good = baseSet({
      enteredWeight: 45,
      enteredUnit: "lb",
      weightEntryMode: "total",
      weightKg: 20.41,
    });
    expect(validateCanonicalWeight(good).ok).toBe(true);
  });
});
