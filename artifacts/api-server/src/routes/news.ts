import { Router, type IRouter } from "express";
import { eq, and, ilike, desc, count } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  ListNewsQueryParams,
  ListNewsResponse,
  CreateNewsBody,
  CreateNewsResponse,
  GetNewsParams,
  GetNewsResponse,
  UpdateNewsParams,
  UpdateNewsBody,
  UpdateNewsResponse,
  DeleteNewsParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapNews(n: typeof newsTable.$inferSelect) {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    excerpt: n.excerpt,
    category: n.category,
    isPinned: n.isPinned,
    isArchived: n.isArchived,
    coverImage: n.coverImage,
    authorName: n.authorName,
    publishedAt: n.publishedAt.toISOString(),
    createdAt: n.createdAt.toISOString(),
  };
}

router.get("/news", async (req, res): Promise<void> => {
  const params = ListNewsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { category, search, pinned, page = 1, limit = 10 } = params.data;
  const offset = (page - 1) * limit;
  const conditions = [eq(newsTable.isArchived, false)];

  if (category) conditions.push(eq(newsTable.category, category));
  if (search) conditions.push(ilike(newsTable.title, `%${search}%`));
  if (pinned !== null && pinned !== undefined) conditions.push(eq(newsTable.isPinned, pinned));

  const whereClause = and(...conditions);

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(newsTable).where(whereClause),
    db.select().from(newsTable).where(whereClause).orderBy(desc(newsTable.isPinned), desc(newsTable.publishedAt)).limit(limit).offset(offset),
  ]);

  res.json(
    ListNewsResponse.parse({
      data: rows.map(mapNews),
      total: Number(totalResult[0].count),
      page,
      limit,
    }),
  );
});

router.post("/news", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [news] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json(CreateNewsResponse.parse(mapNews(news)));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [news] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!news) {
    res.status(404).json({ error: "News article not found" });
    return;
  }

  res.json(GetNewsResponse.parse(mapNews(news)));
});

router.patch("/news/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [news] = await db
    .update(newsTable)
    .set(parsed.data)
    .where(eq(newsTable.id, params.data.id))
    .returning();

  if (!news) {
    res.status(404).json({ error: "News article not found" });
    return;
  }

  res.json(UpdateNewsResponse.parse(mapNews(news)));
});

router.delete("/news/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
