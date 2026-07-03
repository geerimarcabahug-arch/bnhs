import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sslgTable = pgTable("sslg", {
  id: serial("id").primaryKey(),
  adviserName: text("adviser_name").notNull(),
  schoolYear: text("school_year").notNull(),
  description: text("description"),
  projects: text("projects"),
  activities: text("activities"),
});

export const sslgOfficersTable = pgTable("sslg_officers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  committee: text("committee"),
  photoUrl: text("photo_url"),
  schoolYear: text("school_year").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSslgSchema = createInsertSchema(sslgTable).omit({ id: true });
export type InsertSslg = z.infer<typeof insertSslgSchema>;
export type Sslg = typeof sslgTable.$inferSelect;

export const insertSslgOfficerSchema = createInsertSchema(sslgOfficersTable).omit({ id: true, createdAt: true });
export type InsertSslgOfficer = z.infer<typeof insertSslgOfficerSchema>;
export type SslgOfficer = typeof sslgOfficersTable.$inferSelect;
