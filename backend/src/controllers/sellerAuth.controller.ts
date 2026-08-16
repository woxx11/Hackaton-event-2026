import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as sellerAuthService from "../services/sellerAuth.service.js";

export const registerSellerSchema = z.object({
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(6).max(128),
  name: z.string().trim().min(2).max(120),
  shopName: z.string().trim().min(1).max(120).optional(),
});

export const loginSellerSchema = z.object({
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(1),
});

export const registerSellerHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await sellerAuthService.registerSeller(req.body);
  res.status(201).json(result);
});

export const loginSellerHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await sellerAuthService.loginSeller(req.body);
  res.status(200).json(result);
});

export const getSellerProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const seller = await sellerAuthService.getSellerProfile(req.seller!.sellerId);
  res.json(seller);
});
