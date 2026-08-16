import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRateLimiter } from "./middlewares/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { sellerRouter } from "./routers/seller.router.js";
import { clientRouter } from "./routers/client.router.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/seller", sellerRouter);
app.use("/client", clientRouter);

app.use(notFoundHandler);
app.use(errorHandler);
