import { Router, type IRouter } from "express";

const healthRouter: IRouter = Router();

healthRouter.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

export { healthRouter };
export default healthRouter;
