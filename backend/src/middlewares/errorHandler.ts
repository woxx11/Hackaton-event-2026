import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

// Centralized error handler: never leak stack traces, raw DB errors, or
// internal details to the client. Log details server-side, return a
// predictable { error: { code, message, details } } shape.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      console.error(`[${req.method} ${req.originalUrl}]`, err);
    }
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: err.flatten() },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[${req.method} ${req.originalUrl}] Prisma error ${err.code}:`, err.message);
    if (err.code === "P2002") {
      return res.status(409).json({
        error: { code: "CONFLICT", message: "A record with this value already exists" },
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Resource not found" } });
    }
    return res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." },
    });
  }

  console.error(`[${req.method} ${req.originalUrl}] Unhandled error:`, err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: `No route for ${req.method} ${req.originalUrl}` },
  });
}
