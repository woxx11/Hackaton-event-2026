import { prisma } from "./prismaClient.js";

export function findClientByPhone(phone: string) {
  return prisma.client.findUnique({ where: { phone } });
}

export function findClientById(id: string) {
  return prisma.client.findUnique({ where: { id } });
}

export function createClient(data: { phone: string; passwordHash: string; name: string }) {
  return prisma.client.create({ data });
}

// Creates a client record with no password yet — used when a seller adds
// a debtor who hasn't registered an account of their own.
export function createUnclaimedClient(data: { phone: string; name: string }) {
  return prisma.client.create({ data: { ...data, passwordHash: null } });
}

export function claimClient(id: string, passwordHash: string, name: string) {
  return prisma.client.update({ where: { id }, data: { passwordHash, name } });
}

export function linkSellerClient(sellerId: string, clientId: string) {
  return prisma.sellerClient.upsert({
    where: { sellerId_clientId: { sellerId, clientId } },
    create: { sellerId, clientId },
    update: {},
  });
}

export function findSellerClientLink(sellerId: string, clientId: string) {
  return prisma.sellerClient.findUnique({ where: { sellerId_clientId: { sellerId, clientId } } });
}

export function listClientsForSeller(sellerId: string) {
  return prisma.sellerClient.findMany({
    where: { sellerId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
}
