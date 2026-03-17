import connectDB from "./utils/db";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router";
import AppLogger from "./utils/logger";
import { randomUUID } from "crypto";

const logger = AppLogger.getLogger();
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const requestId = randomUUID();
  const startedAt = Date.now();
  res.locals.requestId = requestId;
  logger.info(
    `[http] request_arrived requestId=${requestId} method=${req.method} path=${req.originalUrl}`
  );

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    logger.info(
      `[http] request_completed requestId=${requestId} method=${req.method} path=${req.originalUrl} status=${res.statusCode} durationMs=${durationMs}`
    );
  });

  next();
});
app.use("/api/v1/auth", authRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

await connectDB();
app.listen(port, () => {
  logger.info(`[server] Listening on port ${port}`);
});
