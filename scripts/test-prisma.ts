// scripts/test-prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Trying to connect...");
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log("Connected! Result:", result);
}

main()
  .catch((e) => {
    console.error("Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// node -r dotenv/config scripts/test-prisma.ts
