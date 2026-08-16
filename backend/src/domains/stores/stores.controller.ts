import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import * as storesService from "./stores.service";

export const listStoresHandler = asyncHandler(async (req: Request, res: Response) => {
  const stores = await storesService.listStores(req.auth!);
  res.json({ items: stores });
});

export const getStoreHandler = asyncHandler(async (req: Request, res: Response) => {
  const store = await storesService.getStore(req.auth!, req.params.id);
  res.json(store);
});

export const createStoreHandler = asyncHandler(async (req: Request, res: Response) => {
  const store = await storesService.createStore(req.auth!, req.body);
  res.status(201).json(store);
});

export const updateStoreHandler = asyncHandler(async (req: Request, res: Response) => {
  const store = await storesService.updateStore(req.auth!, req.params.id, req.body);
  res.json(store);
});
