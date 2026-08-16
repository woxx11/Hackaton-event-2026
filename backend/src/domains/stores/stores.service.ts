import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { recordAuditLog } from "@/lib/auditLog";
import type { AuthContext } from "@/types/express";
import type { CreateStoreInput, UpdateStoreInput } from "./stores.schema";

export async function listStores(auth: AuthContext) {
  return prisma.store.findMany({
    where: { companyId: auth.companyId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getStore(auth: AuthContext, storeId: string) {
  const store = await prisma.store.findFirst({ where: { id: storeId, companyId: auth.companyId } });
  if (!store) throw AppError.notFound("Store not found");
  return store;
}

export async function createStore(auth: AuthContext, input: CreateStoreInput) {
  const existing = await prisma.store.findUnique({
    where: { companyId_code: { companyId: auth.companyId, code: input.code } },
  });
  if (existing) throw AppError.conflict(`Store code "${input.code}" is already in use`);

  const store = await prisma.store.create({ data: { ...input, companyId: auth.companyId } });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "store.created",
    entityType: "Store",
    entityId: store.id,
  });
  return store;
}

export async function updateStore(auth: AuthContext, storeId: string, input: UpdateStoreInput) {
  await getStore(auth, storeId);
  const store = await prisma.store.update({ where: { id: storeId }, data: input });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "store.updated",
    entityType: "Store",
    entityId: store.id,
    metadata: input,
  });
  return store;
}
