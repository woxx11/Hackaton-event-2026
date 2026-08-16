import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as debtService from "../services/debt.service.js";

export const createDebtSchema = z.object({
  clientId: z.string().min(1),
  notes: z.string().trim().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "Kamida bitta mahsulot kerak"),
});

export const listDebtsQuerySchema = z.object({
  clientId: z.string().optional(),
  status: z.enum(["OPEN", "PARTIALLY_PAID", "PAID"]).optional(),
});

export const addPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
});

export const createDebtHandler = asyncHandler(async (req: Request, res: Response) => {
  const debt = await debtService.createDebt(req.seller!.sellerId, req.body);
  res.status(201).json(debt);
});

export const listDebtsForSellerHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as z.infer<typeof listDebtsQuerySchema>;
  const debts = await debtService.listDebtsForSeller(req.seller!.sellerId, query);
  res.json({ items: debts });
});

export const getDebtForSellerHandler = asyncHandler(async (req: Request, res: Response) => {
  const debt = await debtService.getDebtForSeller(req.seller!.sellerId, req.params.id);
  res.json(debt);
});

export const addPaymentHandler = asyncHandler(async (req: Request, res: Response) => {
  const debt = await debtService.addPayment(req.seller!.sellerId, req.params.id, req.body.amount);
  res.status(201).json(debt);
});

export const listDebtsForClientHandler = asyncHandler(async (req: Request, res: Response) => {
  const debts = await debtService.listDebtsForClient(req.client!.clientId);
  res.json({ items: debts });
});

export const getDebtForClientHandler = asyncHandler(async (req: Request, res: Response) => {
  const debt = await debtService.getDebtForClient(req.client!.clientId, req.params.id);
  res.json(debt);
});
