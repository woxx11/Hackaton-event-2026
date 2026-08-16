import { Router } from "express";
import { requireSeller } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { authRateLimiter } from "../middlewares/rateLimit.js";
import {
  registerSellerSchema,
  loginSellerSchema,
  registerSellerHandler,
  loginSellerHandler,
  getSellerProfileHandler,
} from "../controllers/sellerAuth.controller.js";
import {
  createProductSchema,
  updateProductSchema,
  createProductHandler,
  listProductsHandler,
  updateProductHandler,
} from "../controllers/product.controller.js";
import {
  addClientSchema,
  addClientHandler,
  listClientsHandler,
} from "../controllers/sellerClient.controller.js";
import {
  createDebtSchema,
  listDebtsQuerySchema,
  addPaymentSchema,
  createDebtHandler,
  listDebtsForSellerHandler,
  getDebtForSellerHandler,
  addPaymentHandler,
} from "../controllers/debt.controller.js";

export const sellerRouter = Router();

// Auth (public)
sellerRouter.post(
  "/auth/register",
  authRateLimiter,
  validate({ body: registerSellerSchema }),
  registerSellerHandler,
);
sellerRouter.post("/auth/login", authRateLimiter, validate({ body: loginSellerSchema }), loginSellerHandler);

// Everything below requires a seller session
sellerRouter.use(requireSeller);

sellerRouter.get("/me", getSellerProfileHandler);

sellerRouter.get("/products", listProductsHandler);
sellerRouter.post("/products", validate({ body: createProductSchema }), createProductHandler);
sellerRouter.patch("/products/:id", validate({ body: updateProductSchema }), updateProductHandler);

sellerRouter.get("/clients", listClientsHandler);
sellerRouter.post("/clients", validate({ body: addClientSchema }), addClientHandler);

sellerRouter.get("/debts", validate({ query: listDebtsQuerySchema }), listDebtsForSellerHandler);
sellerRouter.post("/debts", validate({ body: createDebtSchema }), createDebtHandler);
sellerRouter.get("/debts/:id", getDebtForSellerHandler);
sellerRouter.post("/debts/:id/payments", validate({ body: addPaymentSchema }), addPaymentHandler);
