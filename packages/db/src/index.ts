import { PrismaClient } from "@prisma/client";

// Single shared Prisma client for the whole monorepo.
// Import this from apps/api instead of instantiating PrismaClient elsewhere.
export const prisma = new PrismaClient();

export * from "@prisma/client";
