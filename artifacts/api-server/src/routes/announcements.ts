import { Router, type IRouter } from "express";
import { eq, and, desc, count } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import {
  ListAnnouncementsQueryParams,
  ListAnnouncementsResponse,
  CreateAnnouncementBody,
  CreateAnnouncementResponse,
  GetAnnouncementParams,
  GetAnnouncementResponse,
  UpdateAnnouncementParams,
  UpdateAnnouncementBody,
  UpdateAnnouncementResponse,
  DeleteAnnouncementParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapAnnouncement(a: typeof announcementsTable.$inferSelect) {
  return {
    id: a.id,
    title: a.title,
    content: a.content,
    isPinned: a.isPinned,
    isEmergency: a.isEmergency,
    expiresAt: a.expiresAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  };
}

router.get("/announcements", async (req, res): Promise<void> => {
  const params = ListAnnouncementsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { pinned, emergency, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;
  const conditions = [];

  if (pinned !== null && pinned !== undefined) conditions.push(eq(announcementsTable.isPinned, pinned));
  if (emergency !== null && emergency !== undefined) conditions.push(eq(announcementsTable.isEmergency, emergency));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(announcementsTable).where(whereClause),
    db.select().from(announcementsTable).where(whereClause)
      .orderBy(desc(announcementsTable.isPinned), desc(announcementsTable.createdAt))
      .limit(limit).offset(offset),
  ]);

  res.json(
    ListAnnouncementsResponse.parse({
      data: rows.map(mapAnnouncement),
      total: Number(totalResult[0].count),
      page,
      limit,
    }),
  );
});

router.post("/announcements", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const values: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.expiresAt) {
    values.expiresAt = new Date(parsed.data.expiresAt);
  }

  const [ann] = await db.insert(announcementsTable).values(values as typeof announcementsTable.$inferInsert).returning();
  res.status(201).json(CreateAnnouncementResponse.parse(mapAnnouncement(ann)));
});

router.get("/announcements/:id", async (req, res): Promise<void> => {
  const params = GetAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [ann] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, params.data.id));
  if (!ann) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.json(GetAnnouncementResponse.parse(mapAnnouncement(ann)));
});

router.patch("/announcements/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const values: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.expiresAt) {
    values.expiresAt = new Date(parsed.data.expiresAt);
  }

  const [ann] = await db
    .update(announcementsTable)
    .set(values as typeof announcementsTable.$inferInsert)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();

  if (!ann) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.json(UpdateAnnouncementResponse.parse(mapAnnouncement(ann)));
});

router.delete("/announcements/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(announcementsTable).where(eq(announcementsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
