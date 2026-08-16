import { prisma } from "./prismaClient.js";

export function findSellerByPhone(phone: string) {
  return prisma.seller.findUnique({ where: { phone } });
}

export function findSellerById(id: string) {
  return prisma.seller.findUnique({ where: { id } });
}

export function createSeller(data: {
  phone: string;
  passwordHash: string;
  name: string;
  shopName?: string;
}) {
  return prisma.seller.create({ data });
}
