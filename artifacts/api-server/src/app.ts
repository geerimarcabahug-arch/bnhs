import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";

const pinoHttp = (pinoHttp as unknown as { default?: typeof pinoHttpModule.pinoHttp }).default
  ?? (pinoHttp as unknown as typeof pinoHttpModule.pinoHttp);
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
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);

// Allow localhost in dev plus all Replit preview/deployment domains in all environments
const allowedOrigins: (string | RegExp)[] = [
  /^https?:\/\/localhost(:\d+)?$/,
  /\.replit\.dev$/,
  /\.repl\.co$/,
  /\.replit\.app$/,
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin requests (no Origin header) and Replit's in-iframe previews
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((pattern) =>
        typeof pattern === "string" ? pattern === origin : pattern.test(origin),
      );
      callback(allowed ? null : new Error("Not allowed by CORS"), allowed);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

app.use("/api", router);

// Centralized JSON error middleware — must be last, after all routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error && err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "CORS: origin not allowed" });
    return;
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: message });
});

export default app;
