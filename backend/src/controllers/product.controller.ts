import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as productService from "../services/product.service.js";

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.seller!.sellerId, req.body);
  res.status(201).json(product);
});

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.listProducts(req.seller!.sellerId);
  res.json({ items: products });
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.seller!.sellerId, req.params.id, req.body);
  res.json(product);
});
