export type ValidationOk = { ok: true };
export type ValidationFail = { ok: false; errors: string[] };
export type ValidationResult = ValidationOk | ValidationFail;

export function ok(): ValidationOk {
  return { ok: true };
}

export function fail(...errors: string[]): ValidationFail {
  return { ok: false, errors };
}

export function combine(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((r) => (r.ok ? [] : r.errors));
  return errors.length === 0 ? ok() : fail(...errors);
}
