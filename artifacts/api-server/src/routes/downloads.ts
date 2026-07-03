import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, downloadsTable } from "@workspace/db";
import {
  ListDownloadsQueryParams,
  ListDownloadsResponse,
  CreateDownloadBody,
  CreateDownloadResponse,
  UpdateDownloadParams,
  UpdateDownloadBody,
  UpdateDownloadResponse,
  DeleteDownloadParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapDownload(d: typeof downloadsTable.$inferSelect) {
  return {
    id: d.id,
    title: d.title,
    description: d.description,
    category: d.category,
    fileName: d.fileName,
    fileUrl: d.fileUrl,
    createdAt: d.createdAt.toISOString(),
  };
}

router.get("/downloads", async (req, res): Promise<void> => {
  const params = ListDownloadsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { category } = params.data;
  const rows = await db
    .select()
    .from(downloadsTable)
    .where(category ? eq(downloadsTable.category, category) : undefined)
    .orderBy(downloadsTable.category, desc(downloadsTable.createdAt));

  res.json(ListDownloadsResponse.parse(rows.map(mapDownload)));
});

router.post("/downloads", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDownloadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [d] = await db.insert(downloadsTable).values(parsed.data).returning();
  res.status(201).json(CreateDownloadResponse.parse(mapDownload(d)));
});

router.patch("/downloads/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateDownloadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateDownloadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [d] = await db
    .update(downloadsTable)
    .set(parsed.data)
    .where(eq(downloadsTable.id, params.data.id))
    .returning();

  if (!d) {
    res.status(404).json({ error: "Download not found" });
    return;
  }

  res.json(UpdateDownloadResponse.parse(mapDownload(d)));
});

router.delete("/downloads/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteDownloadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(downloadsTable).where(eq(downloadsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
