import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import {
  listProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  addVariantSchema,
  updateVariantSchema,
  createCategorySchema,
  createBrandSchema,
} from "./products.schema";
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  addVariantHandler,
  updateVariantHandler,
  listCategoriesHandler,
  createCategoryHandler,
  listBrandsHandler,
  createBrandHandler,
} from "./products.controller";

export const productsRouter = Router();
productsRouter.use(requireAuth);

productsRouter.get("/", validate({ query: listProductsQuerySchema }), listProductsHandler);
productsRouter.get("/:id", getProductHandler);
productsRouter.post(
  "/",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: createProductSchema }),
  createProductHandler,
);
productsRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: updateProductSchema }),
  updateProductHandler,
);
productsRouter.post(
  "/:id/variants",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: addVariantSchema }),
  addVariantHandler,
);
productsRouter.patch(
  "/:id/variants/:variantId",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: updateVariantSchema }),
  updateVariantHandler,
);

export const categoriesRouter = Router();
categoriesRouter.use(requireAuth);
categoriesRouter.get("/", listCategoriesHandler);
categoriesRouter.post(
  "/",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: createCategorySchema }),
  createCategoryHandler,
);

export const brandsRouter = Router();
brandsRouter.use(requireAuth);
brandsRouter.get("/", listBrandsHandler);
brandsRouter.post(
  "/",
  requirePermission(PERMISSIONS.PRODUCT_MANAGE),
  validate({ body: createBrandSchema }),
  createBrandHandler,
);
