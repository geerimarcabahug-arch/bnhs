import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, sslgTable, sslgOfficersTable } from "@workspace/db";
import {
  GetSSLGResponse,
  UpdateSSLGBody,
  UpdateSSLGResponse,
  ListSSLGOfficersResponse,
  CreateSSLGOfficerBody,
  CreateSSLGOfficerResponse,
  DeleteSSLGOfficerParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapSslg(s: typeof sslgTable.$inferSelect) {
  return {
    id: s.id,
    adviserName: s.adviserName,
    schoolYear: s.schoolYear,
    description: s.description,
    projects: s.projects,
    activities: s.activities,
  };
}

function mapOfficer(o: typeof sslgOfficersTable.$inferSelect) {
  return {
    id: o.id,
    name: o.name,
    position: o.position,
    committee: o.committee,
    photoUrl: o.photoUrl,
    schoolYear: o.schoolYear,
  };
}

router.get("/sslg", async (_req, res): Promise<void> => {
  const [sslg] = await db.select().from(sslgTable).limit(1);
  if (!sslg) {
    res.json(GetSSLGResponse.parse({ id: 0, adviserName: "", schoolYear: "" }));
    return;
  }
  res.json(GetSSLGResponse.parse(mapSslg(sslg)));
});

router.put("/sslg", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateSSLGBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(sslgTable).limit(1);
  let result;
  if (existing) {
    [result] = await db.update(sslgTable).set(parsed.data).where(eq(sslgTable.id, existing.id)).returning();
  } else {
    [result] = await db.insert(sslgTable).values(parsed.data).returning();
  }

  res.json(UpdateSSLGResponse.parse(mapSslg(result)));
});

router.get("/sslg/officers", async (_req, res): Promise<void> => {
  const officers = await db.select().from(sslgOfficersTable).orderBy(sslgOfficersTable.schoolYear, sslgOfficersTable.name);
  res.json(ListSSLGOfficersResponse.parse(officers.map(mapOfficer)));
});

router.post("/sslg/officers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateSSLGOfficerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [officer] = await db.insert(sslgOfficersTable).values(parsed.data).returning();
  res.status(201).json(CreateSSLGOfficerResponse.parse(mapOfficer(officer)));
});

router.delete("/sslg/officers/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteSSLGOfficerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(sslgOfficersTable).where(eq(sslgOfficersTable.id, params.data.id));
  res.status(204).send();
});

export default router;
