import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter: new PrismaLibSQL(createClient({
      url: env.DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    })),
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
