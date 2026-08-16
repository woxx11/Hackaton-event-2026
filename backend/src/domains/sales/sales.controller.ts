import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import * as salesService from "./sales.service";

export const listSalesHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await salesService.listSales(req.auth!, req.query as never));
});

export const getSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await salesService.getSale(req.auth!, req.params.id));
});

export const createSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await salesService.createSale(req.auth!, req.body));
});

export const voidSaleHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await salesService.voidSale(req.auth!, req.params.id, req.body));
});
