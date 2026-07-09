import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const useSsl = /neon\.tech|sslmode=require/.test(process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  max: 10,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

export const db = drizzle(pool, { schema });
