import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ [Prisma] ERRO FATAL: DATABASE_URL não foi encontrada no process.env!");
  throw new Error("DATABASE_URL ausente.");
}

// Log sanitizado para confirmar qual host o servidor do Next está enxergando
try {
  const parsed = new URL(dbUrl);
  console.log(`✅ [Prisma] Conectando ao host: ${parsed.hostname} na porta: ${parsed.port}`);
} catch {
  console.error("❌ [Prisma] ERRO FATAL: A DATABASE_URL está malformatada!", dbUrl);
}

// Configura o pool do PG
const pool = new Pool({ 
  connectionString: dbUrl 
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}