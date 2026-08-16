import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "@/config/env";
import { apiRateLimiter } from "@/middleware/rateLimit";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";
import { authRouter } from "@/domains/auth/auth.routes";
import { companiesRouter } from "@/domains/companies/companies.routes";
import { storesRouter } from "@/domains/stores/stores.routes";
import { productsRouter, categoriesRouter, brandsRouter } from "@/domains/products/products.routes";
import { inventoryRouter } from "@/domains/inventory/inventory.routes";
import { customersRouter } from "@/domains/customers/customers.routes";
import { salesRouter } from "@/domains/sales/sales.routes";
import { auditRouter } from "@/domains/audit/audit.routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRouter);
app.use("/companies", companiesRouter);
app.use("/stores", storesRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/inventory", inventoryRouter);
app.use("/customers", customersRouter);
app.use("/sales", salesRouter);
app.use("/audit-logs", auditRouter);

app.use(notFoundHandler);
app.use(errorHandler);
