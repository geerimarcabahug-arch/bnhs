import { Router, type IRouter } from "express";
import { eq, ilike, and, count, asc } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  ListStudentsQueryParams,
  ListStudentsResponse,
  CreateStudentBody,
  CreateStudentResponse,
  GetStudentParams,
  GetStudentResponse,
  UpdateStudentParams,
  UpdateStudentBody,
  UpdateStudentResponse,
  DeleteStudentParams,
  GetStudentsByGradeResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function mapStudent(s: typeof studentsTable.$inferSelect) {
  return {
    id: s.id,
    studentId: s.studentId,
    firstName: s.firstName,
    lastName: s.lastName,
    grade: s.grade,
    section: s.section,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/students/by-grade", requireAuth, async (req, res): Promise<void> => {
  const groups = await db
    .select({ grade: studentsTable.grade, section: studentsTable.section, count: count() })
    .from(studentsTable)
    .groupBy(studentsTable.grade, studentsTable.section)
    .orderBy(studentsTable.grade, studentsTable.section);

  res.json(
    GetStudentsByGradeResponse.parse(
      groups.map((g) => ({ grade: g.grade, section: g.section, count: Number(g.count) })),
    ),
  );
});

router.get("/students", requireAuth, async (req, res): Promise<void> => {
  const params = ListStudentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { grade, section, search, page = 1, limit = 50 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (grade) conditions.push(eq(studentsTable.grade, grade));
  if (section) conditions.push(eq(studentsTable.section, section));
  if (search) {
    conditions.push(
      ilike(studentsTable.firstName, `%${search}%`),
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(studentsTable).where(whereClause),
    db.select().from(studentsTable).where(whereClause).orderBy(studentsTable.grade, studentsTable.section, studentsTable.lastName).limit(limit).offset(offset),
  ]);

  res.json(
    ListStudentsResponse.parse({
      data: rows.map(mapStudent),
      total: Number(totalResult[0].count),
      page,
      limit,
    }),
  );
});

router.post("/students", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [student] = await db.insert(studentsTable).values(parsed.data).returning();
  res.status(201).json(CreateStudentResponse.parse(mapStudent(student)));
});

router.get("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(GetStudentResponse.parse(mapStudent(student)));
});

router.patch("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [student] = await db
    .update(studentsTable)
    .set(parsed.data)
    .where(eq(studentsTable.id, params.data.id))
    .returning();

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  res.json(UpdateStudentResponse.parse(mapStudent(student)));
});

router.delete("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(studentsTable).where(eq(studentsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
