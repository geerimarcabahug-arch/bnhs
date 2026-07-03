import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

// Fail fast — never allow a missing or insecure fallback secret
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  logger.error("SESSION_SECRET environment variable is required but was not set. Exiting.");
  process.exit(1);
}

const PgSession = ConnectPgSimple(session);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);
