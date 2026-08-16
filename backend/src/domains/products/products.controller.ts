import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import * as productsService from "./products.service";

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await productsService.listProducts(req.auth!, req.query as never));
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await productsService.getProduct(req.auth!, req.params.id));
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await productsService.createProduct(req.auth!, req.body));
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await productsService.updateProduct(req.auth!, req.params.id, req.body));
});

export const addVariantHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await productsService.addVariant(req.auth!, req.params.id, req.body));
});

export const updateVariantHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await productsService.updateVariant(req.auth!, req.params.id, req.params.variantId, req.body),
  );
});

export const listCategoriesHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ items: await productsService.listCategories(req.auth!) });
});

export const createCategoryHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await productsService.createCategory(req.auth!, req.body));
});

export const listBrandsHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ items: await productsService.listBrands(req.auth!) });
});

export const createBrandHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await productsService.createBrand(req.auth!, req.body));
});
