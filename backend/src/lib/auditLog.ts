import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Request } from "express";

interface RecordAuditLogInput {
  companyId: string;
  actorId?: string | null;
  action: string; // "<entity>.<verb>", e.g. "sale.created", "product.price_changed"
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}

// Fire-and-forget by design: an audit log write failing must never fail
// the business operation it's recording. Errors are logged, not thrown.
export async function recordAuditLog(input: RecordAuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        companyId: input.companyId,
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
        ipAddress: input.req?.ip,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", input.action, err);
  }
}
