import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { listInventoryQuerySchema, adjustInventorySchema, setReorderLevelsSchema } from "./inventory.schema";
import {
  listInventoryHandler,
  adjustInventoryHandler,
  setReorderLevelsHandler,
  getReorderRecommendationsHandler,
} from "./inventory.controller";

export const inventoryRouter = Router();
inventoryRouter.use(requireAuth, requirePermission(PERMISSIONS.INVENTORY_VIEW));

inventoryRouter.get("/", validate({ query: listInventoryQuerySchema }), listInventoryHandler);
inventoryRouter.get("/reorder-recommendations", getReorderRecommendationsHandler);
inventoryRouter.post(
  "/adjust",
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  validate({ body: adjustInventorySchema }),
  adjustInventoryHandler,
);
inventoryRouter.put(
  "/:variantId/reorder-levels/:storeId",
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  validate({ body: setReorderLevelsSchema }),
  setReorderLevelsHandler,
);
