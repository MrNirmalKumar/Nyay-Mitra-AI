import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Safe database helper that verifies connection or catches errors gracefully
 * so the application remains 100% operational in Demo Mode even if MySQL is offline.
 */
export async function safeDbQuery<T>(queryFn: () => Promise<T>, fallbackData: T): Promise<{ data: T; isFallback: boolean }> {
  try {
    const data = await queryFn();
    return { data, isFallback: false };
  } catch (error) {
    console.warn("Database operation failed or MySQL is unreachable. Falling back to local state.", error);
    return { data: fallbackData, isFallback: true };
  }
}
