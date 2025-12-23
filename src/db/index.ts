import { DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.ts";

const pool = new Pool({
  connectionString: DATABASE_URL
});

export const db = drizzle(pool, { schema, logger: true });
