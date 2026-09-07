import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";

/**
 * Idempotent seed: safe to re-run.
 * Creates (or updates) the curator account used to maintain the global catalog.
 *
 * Override email with SEED_CURATOR_EMAIL. No password here — Auth.js (Phase 3)
 * will own sign-in; this row is the domain identity + role only.
 */
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const email = process.env.SEED_CURATOR_EMAIL ?? "curator@gymtrack.local";

  try {
    const curator = await prisma.user.upsert({
      where: { email },
      update: { role: UserRole.curator },
      create: {
        email,
        name: "Curator",
        role: UserRole.curator,
        trainingProfile: {
          create: {},
        },
      },
      include: { trainingProfile: true },
    });

    // Ensure profile exists even if the user row already did (upsert update path).
    if (!curator.trainingProfile) {
      await prisma.trainingProfile.create({
        data: { userId: curator.id },
      });
    }

    console.log(`Seeded curator: ${curator.email} (${curator.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
