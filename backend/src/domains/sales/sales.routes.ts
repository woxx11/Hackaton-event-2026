import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { createSaleSchema, listSalesQuerySchema, voidSaleSchema } from "./sales.schema";
import { listSalesHandler, getSaleHandler, createSaleHandler, voidSaleHandler } from "./sales.controller";

export const salesRouter = Router();
salesRouter.use(requireAuth, requirePermission(PERMISSIONS.SALE_VIEW));

salesRouter.get("/", validate({ query: listSalesQuerySchema }), listSalesHandler);
salesRouter.get("/:id", getSaleHandler);
salesRouter.post(
  "/",
  requirePermission(PERMISSIONS.SALE_CREATE),
  validate({ body: createSaleSchema }),
  createSaleHandler,
);
salesRouter.post(
  "/:id/void",
  requirePermission(PERMISSIONS.SALE_VOID),
  validate({ body: voidSaleSchema }),
  voidSaleHandler,
);
