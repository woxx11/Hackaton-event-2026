import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { createStoreSchema, updateStoreSchema } from "./stores.schema";
import {
  listStoresHandler,
  getStoreHandler,
  createStoreHandler,
  updateStoreHandler,
} from "./stores.controller";

export const storesRouter = Router();
storesRouter.use(requireAuth);

storesRouter.get("/", listStoresHandler);
storesRouter.get("/:id", getStoreHandler);
storesRouter.post(
  "/",
  requirePermission(PERMISSIONS.STORE_MANAGE),
  validate({ body: createStoreSchema }),
  createStoreHandler,
);
storesRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.STORE_MANAGE),
  validate({ body: updateStoreSchema }),
  updateStoreHandler,
);
