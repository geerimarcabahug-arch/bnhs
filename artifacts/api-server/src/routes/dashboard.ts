import { Router, type IRouter } from "express";
import { desc, eq, count, gte } from "drizzle-orm";
import { db, studentsTable, personnelTable, newsTable, announcementsTable, eventsTable } from "@workspace/db";
import { GetDashboardStatsResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/dashboard/stats", requireAuth, async (req, res): Promise<void> => {
  const now = new Date();

  const [studentsCount] = await db.select({ count: count() }).from(studentsTable);
  const [personnelCount] = await db.select({ count: count() }).from(personnelTable);
  const [newsCount] = await db.select({ count: count() }).from(newsTable).where(eq(newsTable.isArchived, false));
  const [announcementsCount] = await db.select({ count: count() }).from(announcementsTable);

  const recentNews = await db
    .select({
      id: newsTable.id,
      title: newsTable.title,
      category: newsTable.category,
      publishedAt: newsTable.publishedAt,
      coverImage: newsTable.coverImage,
    })
    .from(newsTable)
    .where(eq(newsTable.isArchived, false))
    .orderBy(desc(newsTable.publishedAt))
    .limit(5);

  const recentAnnouncements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt))
    .limit(5);

  const upcomingEvents = await db
    .select()
    .from(eventsTable)
    .where(gte(eventsTable.startDate, now))
    .orderBy(eventsTable.startDate)
    .limit(5);

  // Group students by grade
  const gradeGroups = await db
    .select({ grade: studentsTable.grade, count: count() })
    .from(studentsTable)
    .groupBy(studentsTable.grade)
    .orderBy(studentsTable.grade);

  const stats = {
    totalStudents: Number(studentsCount.count),
    totalPersonnel: Number(personnelCount.count),
    totalNews: Number(newsCount.count),
    totalAnnouncements: Number(announcementsCount.count),
    recentNews: recentNews.map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      publishedAt: n.publishedAt.toISOString(),
      coverImage: n.coverImage,
    })),
    recentAnnouncements: recentAnnouncements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      isPinned: a.isPinned,
      isEmergency: a.isEmergency,
      expiresAt: a.expiresAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
    })),
    upcomingEvents: upcomingEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() ?? null,
      location: e.location,
      category: e.category,
      createdAt: e.createdAt.toISOString(),
    })),
    studentsByGrade: gradeGroups.map((g) => ({
      grade: g.grade,
      count: Number(g.count),
    })),
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

export default router;
