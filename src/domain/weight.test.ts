import { describe, expect, it } from "vitest";
import { canonicalWeightKg, toKg, weightsEqual } from "@/domain/weight";

describe("weight conversion", () => {
  it("keeps kg as kg", () => {
    expect(toKg(40, "kg")).toBe(40);
  });

  it("converts lb to kg at two decimals", () => {
    expect(toKg(45, "lb")).toBe(20.41);
  });

  it("doubles per_side into canonical total kg (rule 8)", () => {
    expect(canonicalWeightKg(20, "kg", "per_side")).toBe(40);
    expect(canonicalWeightKg(45, "lb", "per_side")).toBe(40.82);
  });

  it("does not double total mode", () => {
    expect(canonicalWeightKg(50, "kg", "total")).toBe(50);
  });

  it("compares at storage precision", () => {
    expect(weightsEqual(20.41, 20.41)).toBe(true);
    expect(weightsEqual(20.41, 20.42)).toBe(false);
  });
});
