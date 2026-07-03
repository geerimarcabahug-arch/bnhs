import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ptaTable, ptaOfficersTable } from "@workspace/db";
import {
  GetPTAResponse,
  UpdatePTABody,
  UpdatePTAResponse,
  ListPTAOfficersResponse,
  CreatePTAOfficerBody,
  CreatePTAOfficerResponse,
  DeletePTAOfficerParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapPta(p: typeof ptaTable.$inferSelect) {
  return {
    id: p.id,
    schoolYear: p.schoolYear,
    constitution: p.constitution,
    projects: p.projects,
    activities: p.activities,
    meetingSchedule: p.meetingSchedule,
  };
}

function mapOfficer(o: typeof ptaOfficersTable.$inferSelect) {
  return {
    id: o.id,
    name: o.name,
    position: o.position,
    schoolYear: o.schoolYear,
  };
}

router.get("/pta", async (_req, res): Promise<void> => {
  const [pta] = await db.select().from(ptaTable).limit(1);
  if (!pta) {
    res.json(GetPTAResponse.parse({ id: 0, schoolYear: "" }));
    return;
  }
  res.json(GetPTAResponse.parse(mapPta(pta)));
});

router.put("/pta", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdatePTABody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(ptaTable).limit(1);
  let result;
  if (existing) {
    [result] = await db.update(ptaTable).set(parsed.data).where(eq(ptaTable.id, existing.id)).returning();
  } else {
    [result] = await db.insert(ptaTable).values(parsed.data).returning();
  }

  res.json(UpdatePTAResponse.parse(mapPta(result)));
});

router.get("/pta/officers", async (_req, res): Promise<void> => {
  const officers = await db.select().from(ptaOfficersTable).orderBy(ptaOfficersTable.schoolYear, ptaOfficersTable.name);
  res.json(ListPTAOfficersResponse.parse(officers.map(mapOfficer)));
});

router.post("/pta/officers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePTAOfficerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [officer] = await db.insert(ptaOfficersTable).values(parsed.data).returning();
  res.status(201).json(CreatePTAOfficerResponse.parse(mapOfficer(officer)));
});

router.delete("/pta/officers/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeletePTAOfficerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(ptaOfficersTable).where(eq(ptaOfficersTable.id, params.data.id));
  res.status(204).send();
});

export default router;
