import type { WeightEntryMode, WeightUnit } from "@/generated/prisma/enums";

/** International avoirdupois pound → kilogram. */
export const LB_TO_KG = 0.45359237;

/** Round to 2 decimal places — matches Decimal(7,2) / Decimal(6,2) storage. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Convert a single plate/dumbbell reading into kilograms.
 * The bar is never included (DOMAIN_SPEC decision 5.12 / rule 9).
 */
export function toKg(enteredWeight: number, unit: WeightUnit): number {
  if (enteredWeight < 0) {
    throw new RangeError("enteredWeight must be >= 0");
  }
  return unit === "kg" ? round2(enteredWeight) : round2(enteredWeight * LB_TO_KG);
}

/**
 * Canonical total load in kg for storage (rule 8).
 * `per_side` means the user typed one side; we store both sides as total.
 */
export function canonicalWeightKg(
  enteredWeight: number,
  unit: WeightUnit,
  mode: WeightEntryMode,
): number {
  const one = toKg(enteredWeight, unit);
  return mode === "per_side" ? round2(one * 2) : one;
}

/** True when two kg values match at storage precision (2 decimals). */
export function weightsEqual(a: number, b: number): boolean {
  return round2(a) === round2(b);
}
