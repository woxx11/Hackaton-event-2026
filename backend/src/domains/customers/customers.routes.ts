import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { listCustomersQuerySchema, createCustomerSchema, updateCustomerSchema } from "./customers.schema";
import {
  listCustomersHandler,
  getCustomerHandler,
  createCustomerHandler,
  updateCustomerHandler,
} from "./customers.controller";

export const customersRouter = Router();
customersRouter.use(requireAuth, requirePermission(PERMISSIONS.CUSTOMER_VIEW));

customersRouter.get("/", validate({ query: listCustomersQuerySchema }), listCustomersHandler);
customersRouter.get("/:id", getCustomerHandler);
customersRouter.post(
  "/",
  requirePermission(PERMISSIONS.CUSTOMER_MANAGE),
  validate({ body: createCustomerSchema }),
  createCustomerHandler,
);
customersRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.CUSTOMER_MANAGE),
  validate({ body: updateCustomerSchema }),
  updateCustomerHandler,
);
