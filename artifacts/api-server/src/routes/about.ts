import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, aboutTable } from "@workspace/db";
import { GetAboutResponse, UpdateAboutBody, UpdateAboutResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapAbout(a: typeof aboutTable.$inferSelect) {
  return {
    id: a.id,
    history: a.history,
    vision: a.vision,
    mission: a.mission,
    coreValues: a.coreValues,
    hymn: a.hymn,
    address: a.address,
    phone: a.phone,
    email: a.email,
    officeHours: a.officeHours,
    facebookUrl: a.facebookUrl,
    principalName: a.principalName,
    principalMessage: a.principalMessage,
  };
}

router.get("/about", async (_req, res): Promise<void> => {
  const [about] = await db.select().from(aboutTable).limit(1);
  if (!about) {
    const [created] = await db
      .insert(aboutTable)
      .values({
        history: "Burgos National High School was established to provide quality secondary education to the youth of Burgos.",
        vision: "A school of excellence producing globally competitive, morally upright, and productive citizens.",
        mission: "To provide quality, equitable, culture-based, and complete basic education.",
        coreValues: "Excellence, Integrity, Service, Respect, Innovation",
        address: "Burgos, Ilocos Sur, Philippines",
        officeHours: "Monday to Friday, 7:00 AM - 5:00 PM",
        principalName: "School Principal",
        principalMessage: "Welcome to Burgos National High School. We are committed to providing quality education to our learners.",
      })
      .returning();
    res.json(GetAboutResponse.parse(mapAbout(created)));
    return;
  }
  res.json(GetAboutResponse.parse(mapAbout(about)));
});

router.put("/about", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateAboutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(aboutTable).limit(1);
  let result;
  if (existing) {
    [result] = await db.update(aboutTable).set(parsed.data).where(eq(aboutTable.id, existing.id)).returning();
  } else {
    [result] = await db.insert(aboutTable).values(parsed.data).returning();
  }

  res.json(UpdateAboutResponse.parse(mapAbout(result)));
});

export default router;
