import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * This module ensures that we only create one instance of Prisma Client
 * across the entire application, which is important for:
 * 1. Connection pooling - prevents creating too many database connections
 * 2. Hot reloading - prevents creating multiple clients during development
 * 
 * In development, the `globalThis` trick allows the client to persist
 * across file changes and hot reloads.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client - Prisma will automatically use DATABASE_URL from .env
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, assign to global to prevent connection issues during hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

