import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ptaTable = pgTable("pta", {
  id: serial("id").primaryKey(),
  schoolYear: text("school_year").notNull(),
  constitution: text("constitution"),
  projects: text("projects"),
  activities: text("activities"),
  meetingSchedule: text("meeting_schedule"),
});

export const ptaOfficersTable = pgTable("pta_officers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  schoolYear: text("school_year").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPtaSchema = createInsertSchema(ptaTable).omit({ id: true });
export type InsertPta = z.infer<typeof insertPtaSchema>;
export type Pta = typeof ptaTable.$inferSelect;

export const insertPtaOfficerSchema = createInsertSchema(ptaOfficersTable).omit({ id: true, createdAt: true });
export type InsertPtaOfficer = z.infer<typeof insertPtaOfficerSchema>;
export type PtaOfficer = typeof ptaOfficersTable.$inferSelect;
