import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import studentsRouter from "./students";
import personnelRouter from "./personnel";
import newsRouter from "./news";
import announcementsRouter from "./announcements";
import eventsRouter from "./events";
import downloadsRouter from "./downloads";
import galleryRouter from "./gallery";
import sslgRouter from "./sslg";
import ptaRouter from "./pta";
import aboutRouter from "./about";
import searchRouter from "./search";
import usersRouter from "./users";

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
