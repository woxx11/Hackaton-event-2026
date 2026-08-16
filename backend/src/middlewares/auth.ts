import type { NextFunction, Request, Response } from "express";
import { findSellerById } from "../data/seller.data.js";
import { findClientById } from "../data/client.data.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAuthToken } from "../utils/jwt.js";

function readToken(req: Request): { id: string; role: string } {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw AppError.unauthorized();
  try {
    return verifyAuthToken(header.slice("Bearer ".length));
  } catch {
    throw AppError.unauthorized("Invalid or expired session");
  }
}

// Verifies the token belongs to a real, still-existing Seller account and
// attaches req.seller. Re-checked against the database on every request
// rather than trusting the token payload alone.
export const requireSeller = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const payload = readToken(req);
  if (payload.role !== "SELLER") throw AppError.forbidden("A seller account is required");

  const seller = await findSellerById(payload.id);
  if (!seller) throw AppError.unauthorized("Invalid or expired session");

  req.seller = { role: "SELLER", sellerId: seller.id };
  next();
});

export const requireClient = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const payload = readToken(req);
  if (payload.role !== "CLIENT") throw AppError.forbidden("A client account is required");

  const client = await findClientById(payload.id);
  if (!client) throw AppError.unauthorized("Invalid or expired session");

  req.client = { role: "CLIENT", clientId: client.id };
  next();
});
