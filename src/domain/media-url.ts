import type { MediaProvider } from "@/generated/prisma/enums";
import { fail, ok, type ValidationResult } from "@/domain/validation";

const PROVIDER_HOSTS: Record<MediaProvider, RegExp[]> = {
  youtube: [
    /^([a-z0-9-]+\.)?youtube\.com$/i,
    /^youtu\.be$/i,
  ],
  instagram: [/^([a-z0-9-]+\.)?instagram\.com$/i],
  other: [], // any https host; still reject non-https
};

/** Validate ExerciseMedia.url: https only, host matches provider when known. */
export function validateMediaUrl(
  url: string,
  provider: MediaProvider,
): ValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail("Media URL is not a valid URL");
  }

  if (parsed.protocol !== "https:") {
    return fail("Media URL must use https");
  }

  const patterns = PROVIDER_HOSTS[provider];
  if (patterns.length > 0 && !patterns.some((re) => re.test(parsed.hostname))) {
    return fail(`Media URL host does not match provider ${provider}`);
  }

  return ok();
}
