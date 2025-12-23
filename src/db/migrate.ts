import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.ts";
import path from "path";

const migrationsFolder = path.join("./drizzle");

const runMigrations = async () => {
  console.log("Running migrations...");
  try {
    await migrate(db as any, {
      migrationsFolder: migrationsFolder
    });
    console.log("Migrations completed successfully. ✅");
    process.exit(0);
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
};

runMigrations();
