import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  ListGalleryQueryParams,
  ListGalleryResponse,
  CreateGalleryItemBody,
  CreateGalleryItemResponse,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapGallery(g: typeof galleryTable.$inferSelect) {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    mediaType: g.mediaType,
    url: g.url,
    thumbnailUrl: g.thumbnailUrl,
    category: g.category,
    createdAt: g.createdAt.toISOString(),
  };
}

router.get("/gallery", async (req, res): Promise<void> => {
  const params = ListGalleryQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { category, media_type } = params.data;
  const conditions = [];
  if (category) conditions.push(eq(galleryTable.category, category));
  if (media_type) conditions.push(eq(galleryTable.mediaType, media_type));

  const rows = await db
    .select()
    .from(galleryTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(galleryTable.createdAt));

  res.json(ListGalleryResponse.parse(rows.map(mapGallery)));
});

router.post("/gallery", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [g] = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(CreateGalleryItemResponse.parse(mapGallery(g)));
});

router.delete("/gallery/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
  res.status(204).send();
});

export default router;
