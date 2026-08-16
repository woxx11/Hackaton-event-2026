import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { recordAuditLog } from "@/lib/auditLog";
import { toSkipTake, paginatedResponse } from "@/utils/pagination";
import type { AuthContext } from "@/types/express";
import type {
  ListProductsQuery,
  CreateProductInput,
  UpdateProductInput,
  VariantInput,
  UpdateVariantInput,
} from "./products.schema";

export async function listProducts(auth: AuthContext, query: ListProductsQuery) {
  const where: Prisma.ProductWhereInput = {
    companyId: auth.companyId,
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.brandId ? { brandId: query.brandId } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { variants: { some: { sku: { contains: query.search, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true, variants: { orderBy: { createdAt: "asc" } } },
      orderBy: { [query.sortBy ?? "createdAt"]: query.sortDir },
      ...toSkipTake(query),
    }),
    prisma.product.count({ where }),
  ]);

  return paginatedResponse(items, total, query);
}

export async function getProduct(auth: AuthContext, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, companyId: auth.companyId },
    include: { category: true, brand: true, variants: { orderBy: { createdAt: "asc" } } },
  });
  if (!product) throw AppError.notFound("Product not found");
  return product;
}

async function assertNoSkuCollision(companyId: string, skus: string[], excludeVariantId?: string) {
  const collision = await prisma.productVariant.findFirst({
    where: { companyId, sku: { in: skus }, id: excludeVariantId ? { not: excludeVariantId } : undefined },
  });
  if (collision) throw AppError.conflict(`SKU "${collision.sku}" is already in use`);
}

export async function createProduct(auth: AuthContext, input: CreateProductInput) {
  await assertNoSkuCollision(auth.companyId, input.variants.map((v) => v.sku));

  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, companyId: auth.companyId },
    });
    if (!category) throw AppError.badRequest("Invalid categoryId");
  }
  if (input.brandId) {
    const brand = await prisma.brand.findFirst({ where: { id: input.brandId, companyId: auth.companyId } });
    if (!brand) throw AppError.badRequest("Invalid brandId");
  }

  const product = await prisma.product.create({
    data: {
      companyId: auth.companyId,
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      brandId: input.brandId,
      variants: {
        create: input.variants.map((v: VariantInput) => ({
          companyId: auth.companyId,
          sku: v.sku,
          barcode: v.barcode,
          name: v.name,
          attributes: v.attributes,
          price: v.price,
          cost: v.cost,
        })),
      },
    },
    include: { variants: true },
  });

  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "product.created",
    entityType: "Product",
    entityId: product.id,
  });

  return product;
}

export async function updateProduct(auth: AuthContext, productId: string, input: UpdateProductInput) {
  await getProduct(auth, productId);
  const product = await prisma.product.update({ where: { id: productId }, data: input });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "product.updated",
    entityType: "Product",
    entityId: product.id,
    metadata: input,
  });
  return product;
}

export async function addVariant(auth: AuthContext, productId: string, input: VariantInput) {
  await getProduct(auth, productId);
  await assertNoSkuCollision(auth.companyId, [input.sku]);

  const variant = await prisma.productVariant.create({
    data: { ...input, companyId: auth.companyId, productId },
  });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "product.variant_added",
    entityType: "ProductVariant",
    entityId: variant.id,
  });
  return variant;
}

export async function updateVariant(
  auth: AuthContext,
  productId: string,
  variantId: string,
  input: UpdateVariantInput,
) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId, productId, companyId: auth.companyId },
  });
  if (!variant) throw AppError.notFound("Variant not found");

  if (input.sku && input.sku !== variant.sku) {
    await assertNoSkuCollision(auth.companyId, [input.sku], variantId);
  }

  const isPriceChange = input.price !== undefined && Number(variant.price) !== input.price;

  const updated = await prisma.productVariant.update({ where: { id: variantId }, data: input });

  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: isPriceChange ? "product.price_changed" : "product.variant_updated",
    entityType: "ProductVariant",
    entityId: variantId,
    metadata: { before: { price: variant.price, cost: variant.cost }, after: input },
  });

  return updated;
}

export async function listCategories(auth: AuthContext) {
  return prisma.category.findMany({ where: { companyId: auth.companyId }, orderBy: { name: "asc" } });
}

export async function createCategory(auth: AuthContext, input: { name: string; parentId?: string }) {
  return prisma.category.create({ data: { ...input, companyId: auth.companyId } });
}

export async function listBrands(auth: AuthContext) {
  return prisma.brand.findMany({ where: { companyId: auth.companyId }, orderBy: { name: "asc" } });
}

export async function createBrand(auth: AuthContext, input: { name: string }) {
  return prisma.brand.create({ data: { ...input, companyId: auth.companyId } });
}
