import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aboutTable = pgTable("about", {
  id: serial("id").primaryKey(),
  history: text("history"),
  vision: text("vision"),
  mission: text("mission"),
  coreValues: text("core_values"),
  hymn: text("hymn"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  officeHours: text("office_hours"),
  facebookUrl: text("facebook_url"),
  principalName: text("principal_name"),
  principalMessage: text("principal_message"),
});

export const insertAboutSchema = createInsertSchema(aboutTable).omit({ id: true });
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type About = typeof aboutTable.$inferSelect;
