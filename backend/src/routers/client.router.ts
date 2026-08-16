import { Router } from "express";
import { requireClient } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { authRateLimiter } from "../middlewares/rateLimit.js";
import {
  registerClientSchema,
  loginClientSchema,
  registerClientHandler,
  loginClientHandler,
  getClientProfileHandler,
} from "../controllers/clientAuth.controller.js";
import { listDebtsForClientHandler, getDebtForClientHandler } from "../controllers/debt.controller.js";

export const clientRouter = Router();

// Auth (public)
clientRouter.post(
  "/auth/register",
  authRateLimiter,
  validate({ body: registerClientSchema }),
  registerClientHandler,
);
clientRouter.post("/auth/login", authRateLimiter, validate({ body: loginClientSchema }), loginClientHandler);

// Everything below requires a client session
clientRouter.use(requireClient);

clientRouter.get("/me", getClientProfileHandler);
clientRouter.get("/debts", listDebtsForClientHandler);
clientRouter.get("/debts/:id", getDebtForClientHandler);
