import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import studentsRouter from "./students.js";
import personnelRouter from "./personnel.js";
import newsRouter from "./news.js";
import announcementsRouter from "./announcements.js";
import eventsRouter from "./events.js";
import downloadsRouter from "./downloads.js";
import galleryRouter from "./gallery.js";
import sslgRouter from "./sslg.js";
import ptaRouter from "./pta.js";
import aboutRouter from "./about.js";
import searchRouter from "./search.js";
import usersRouter from "./users.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(studentsRouter);
router.use(personnelRouter);
router.use(newsRouter);
router.use(announcementsRouter);
router.use(eventsRouter);
router.use(downloadsRouter);
router.use(galleryRouter);
router.use(sslgRouter);
router.use(ptaRouter);
router.use(aboutRouter);
router.use(searchRouter);
router.use(usersRouter);

export default router;
