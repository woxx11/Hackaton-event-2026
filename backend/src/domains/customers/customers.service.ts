import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { recordAuditLog } from "@/lib/auditLog";
import { toSkipTake, paginatedResponse } from "@/utils/pagination";
import type { AuthContext } from "@/types/express";
import type { PaginationInput } from "@/utils/pagination";
import type { CreateCustomerInput, UpdateCustomerInput } from "./customers.schema";

export async function listCustomers(auth: AuthContext, query: PaginationInput) {
  const where: Prisma.CustomerWhereInput = {
    companyId: auth.companyId,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: { loyaltyAccount: true },
      orderBy: { [query.sortBy ?? "createdAt"]: query.sortDir },
      ...toSkipTake(query),
    }),
    prisma.customer.count({ where }),
  ]);

  return paginatedResponse(items, total, query);
}

export async function getCustomer(auth: AuthContext, customerId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, companyId: auth.companyId },
    include: {
      loyaltyAccount: true,
      sales: { orderBy: { createdAt: "desc" }, take: 20 },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!customer) throw AppError.notFound("Customer not found");
  return customer;
}

export async function createCustomer(auth: AuthContext, input: CreateCustomerInput) {
  const customer = await prisma.customer.create({
    data: { ...input, companyId: auth.companyId, loyaltyAccount: { create: {} } },
    include: { loyaltyAccount: true },
  });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "customer.created",
    entityType: "Customer",
    entityId: customer.id,
  });
  return customer;
}

export async function updateCustomer(auth: AuthContext, customerId: string, input: UpdateCustomerInput) {
  await getCustomer(auth, customerId);
  const customer = await prisma.customer.update({ where: { id: customerId }, data: input });
  await recordAuditLog({
    companyId: auth.companyId,
    actorId: auth.userId,
    action: "customer.updated",
    entityType: "Customer",
    entityId: customer.id,
    metadata: input,
  });
  return customer;
}
