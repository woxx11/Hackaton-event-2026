import { Router } from "express";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/auth";
import { authRateLimiter } from "@/middleware/rateLimit";
import { registerCompanySchema, loginSchema } from "./auth.schema";
import { registerCompanyHandler, loginHandler, meHandler } from "./auth.controller";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validate({ body: registerCompanySchema }),
  registerCompanyHandler,
);
authRouter.post("/login", authRateLimiter, validate({ body: loginSchema }), loginHandler);
authRouter.get("/me", requireAuth, meHandler);
