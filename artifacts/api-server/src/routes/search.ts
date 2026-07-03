import { Router, type IRouter } from "express";
import { ilike, eq } from "drizzle-orm";
import { db, newsTable, announcementsTable, personnelTable } from "@workspace/db";
import { SiteSearchQueryParams, SiteSearchResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/search", async (req, res): Promise<void> => {
  const params = SiteSearchQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { q } = params.data;
  const pattern = `%${q}%`;

  const [newsResults, announcementsResults, personnelResults] = await Promise.all([
    db
      .select({
        id: newsTable.id,
        title: newsTable.title,
        category: newsTable.category,
        publishedAt: newsTable.publishedAt,
        coverImage: newsTable.coverImage,
      })
      .from(newsTable)
      .where(ilike(newsTable.title, pattern))
      .limit(5),
    db
      .select()
      .from(announcementsTable)
      .where(ilike(announcementsTable.title, pattern))
      .limit(5),
    db
      .select()
      .from(personnelTable)
      .where(ilike(personnelTable.name, pattern))
      .limit(5),
  ]);

  res.json(
    SiteSearchResponse.parse({
      news: newsResults.map((n) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        publishedAt: n.publishedAt.toISOString(),
        coverImage: n.coverImage,
      })),
      announcements: announcementsResults.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        isPinned: a.isPinned,
        isEmergency: a.isEmergency,
        expiresAt: a.expiresAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
      })),
      personnel: personnelResults.map((p) => ({
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
      })),
    }),
  );
});

export default router;
