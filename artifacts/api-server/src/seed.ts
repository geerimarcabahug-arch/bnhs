import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./lib/logger";

export async function seedDefaultAdmin() {
  try {
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, "admin"));

    const hash = await bcrypt.hash("admin123", 10);

    if (!existing) {
      await db.insert(usersTable).values({
        username: "admin",
        passwordHash: hash,
        name: "System Administrator",
        email: "admin@bnhs.edu.ph",
        role: "admin",
      });
      logger.info("Default admin user created");
    } else if (!existing.role || existing.role !== "admin") {
      await db
        .update(usersTable)
        .set({ role: "admin", passwordHash: hash })
        .where(eq(usersTable.username, "admin"));
      logger.info("Default admin user updated");
    } else {
      // Always ensure the hash is correct on startup
      await db
        .update(usersTable)
        .set({ passwordHash: hash })
        .where(eq(usersTable.username, "admin"));
      logger.info("Default admin password verified");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed default admin — continuing anyway");
  }
}
