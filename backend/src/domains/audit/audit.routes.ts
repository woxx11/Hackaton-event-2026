import { Router } from "express";
import { z } from "zod";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { paginationSchema, toSkipTake, paginatedResponse } from "@/utils/pagination";

const listAuditLogsQuerySchema = paginationSchema.extend({
  entityType: z.string().trim().optional(),
});

export const auditRouter = Router();
auditRouter.use(requireAuth, requirePermission(PERMISSIONS.AUDIT_LOG_VIEW));

auditRouter.get(
  "/",
  validate({ query: listAuditLogsQuerySchema }),
  asyncHandler(async (req, res) => {
    const query = req.query as unknown as z.infer<typeof listAuditLogsQuerySchema>;
    const where = {
      companyId: req.auth!.companyId,
      ...(query.entityType ? { entityType: query.entityType } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { actor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        ...toSkipTake(query),
      }),
      prisma.auditLog.count({ where }),
    ]);
    res.json(paginatedResponse(items, total, query));
  }),
);
