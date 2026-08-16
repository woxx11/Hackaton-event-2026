import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import * as inventoryService from "./inventory.service";

export const listInventoryHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ items: await inventoryService.listInventory(req.auth!, req.query as never) });
});

export const adjustInventoryHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await inventoryService.adjustInventory(req.auth!, req.body));
});

export const setReorderLevelsHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await inventoryService.setReorderLevels(
      req.auth!,
      req.params.variantId,
      req.params.storeId,
      req.body,
    ),
  );
});

export const getReorderRecommendationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const storeId = typeof req.query.storeId === "string" ? req.query.storeId : undefined;
  res.json({ items: await inventoryService.getReorderRecommendations(req.auth!, storeId) });
});
