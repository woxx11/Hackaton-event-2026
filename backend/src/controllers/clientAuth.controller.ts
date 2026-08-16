import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as clientAuthService from "../services/clientAuth.service.js";

export const registerClientSchema = z.object({
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(6).max(128),
  name: z.string().trim().min(2).max(120),
});

export const loginClientSchema = z.object({
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(1),
});

export const registerClientHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await clientAuthService.registerClient(req.body);
  res.status(201).json(result);
});

export const loginClientHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await clientAuthService.loginClient(req.body);
  res.status(200).json(result);
});

export const getClientProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const client = await clientAuthService.getClientProfile(req.client!.clientId);
  res.json(client);
});
