import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as sellerClientService from "../services/sellerClient.service.js";

export const addClientSchema = z.object({
  phone: z.string().trim().min(7).max(20),
  name: z.string().trim().min(2).max(120),
});

export const addClientHandler = asyncHandler(async (req: Request, res: Response) => {
  const client = await sellerClientService.addClientToSeller(req.seller!.sellerId, req.body);
  res.status(201).json(client);
});

export const listClientsHandler = asyncHandler(async (req: Request, res: Response) => {
  const clients = await sellerClientService.listSellerClients(req.seller!.sellerId);
  res.json({ items: clients });
});
