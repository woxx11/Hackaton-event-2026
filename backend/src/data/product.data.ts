import { prisma } from "./prismaClient.js";

export function createProduct(data: { sellerId: string; name: string; price: number; stock: number }) {
  return prisma.product.create({ data });
}

export function listProductsForSeller(sellerId: string) {
  return prisma.product.findMany({ where: { sellerId, isActive: true }, orderBy: { createdAt: "desc" } });
}

export function findProductByIdForSeller(id: string, sellerId: string) {
  return prisma.product.findFirst({ where: { id, sellerId } });
}

export function findProductsByIdsForSeller(ids: string[], sellerId: string) {
  return prisma.product.findMany({ where: { id: { in: ids }, sellerId } });
}

export function updateProduct(
  id: string,
  data: Partial<{ name: string; price: number; stock: number; isActive: boolean }>,
) {
  return prisma.product.update({ where: { id }, data });
}
