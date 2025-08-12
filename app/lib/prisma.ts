import { PrismaClient } from "@prisma/client";

// Avoid re-instantiating Prisma during hot reloads in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

