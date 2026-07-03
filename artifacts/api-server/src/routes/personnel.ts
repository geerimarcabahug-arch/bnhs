import { Router, type IRouter } from "express";
import { eq, and, ilike } from "drizzle-orm";
import { db, personnelTable } from "@workspace/db";
import {
  ListPersonnelQueryParams,
  ListPersonnelResponse,
  CreatePersonnelBody,
  CreatePersonnelResponse,
  GetPersonnelParams,
  GetPersonnelResponse,
  UpdatePersonnelParams,
  UpdatePersonnelBody,
  UpdatePersonnelResponse,
  DeletePersonnelParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapPersonnel(p: typeof personnelTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    position: p.position,
    type: p.type,
    department: p.department,
    advisoryClass: p.advisoryClass,
    email: p.email,
    office: p.office,
    photoUrl: p.photoUrl,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/personnel", async (req, res): Promise<void> => {
  const params = ListPersonnelQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { type, search } = params.data;
  const conditions = [];
  if (type) conditions.push(eq(personnelTable.type, type));
  if (search) conditions.push(ilike(personnelTable.name, `%${search}%`));

  const rows = await db
    .select()
    .from(personnelTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(personnelTable.name);

  res.json(ListPersonnelResponse.parse(rows.map(mapPersonnel)));
});

router.post("/personnel", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePersonnelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [p] = await db.insert(personnelTable).values(parsed.data).returning();
  res.status(201).json(CreatePersonnelResponse.parse(mapPersonnel(p)));
});

router.get("/personnel/:id", async (req, res): Promise<void> => {
  const params = GetPersonnelParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [p] = await db.select().from(personnelTable).where(eq(personnelTable.id, params.data.id));
  if (!p) {
    res.status(404).json({ error: "Personnel not found" });
    return;
  }

  res.json(GetPersonnelResponse.parse(mapPersonnel(p)));
});

router.patch("/personnel/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdatePersonnelParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePersonnelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [p] = await db
    .update(personnelTable)
    .set(parsed.data)
    .where(eq(personnelTable.id, params.data.id))
    .returning();

  if (!p) {
    res.status(404).json({ error: "Personnel not found" });
    return;
  }

  res.json(UpdatePersonnelResponse.parse(mapPersonnel(p)));
});

router.delete("/personnel/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeletePersonnelParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(personnelTable).where(eq(personnelTable.id, params.data.id));
  res.status(204).send();
});

export default router;
