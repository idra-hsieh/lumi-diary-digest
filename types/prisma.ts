import { PrismaClient } from "@prisma/client";

// Type helper to get Diary model type from Prisma
export type Diary = Awaited<
  ReturnType<PrismaClient["diary"]["findMany"]>
>[number];

