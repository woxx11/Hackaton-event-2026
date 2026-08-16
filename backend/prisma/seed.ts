import { PrismaClient } from "@prisma/client";
import { ALL_PERMISSIONS } from "../src/utils/permissions";

const prisma = new PrismaClient();

// Seeds the global permission catalog. Idempotent — safe to run on every
// deploy. Per-company roles are created at company registration time and
// reference these rows by key.
async function main() {
  for (const key of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key, description: key },
      update: {},
    });
  }
  console.log(`Seeded ${ALL_PERMISSIONS.length} permissions.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
