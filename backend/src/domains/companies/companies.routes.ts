import { Router } from "express";
import { requireAuth, requirePermission } from "@/middleware/auth";
import { validate } from "@/middleware/validate";
import { PERMISSIONS } from "@/utils/permissions";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/utils/asyncHandler";
import { recordAuditLog } from "@/lib/auditLog";
import { updateCompanySchema } from "./companies.schema";

export const companiesRouter = Router();
companiesRouter.use(requireAuth);

companiesRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const company = await prisma.company.findUniqueOrThrow({ where: { id: req.auth!.companyId } });
    res.json(company);
  }),
);

companiesRouter.patch(
  "/me",
  requirePermission(PERMISSIONS.COMPANY_MANAGE),
  validate({ body: updateCompanySchema }),
  asyncHandler(async (req, res) => {
    const company = await prisma.company.update({ where: { id: req.auth!.companyId }, data: req.body });
    await recordAuditLog({
      companyId: req.auth!.companyId,
      actorId: req.auth!.userId,
      action: "company.updated",
      entityType: "Company",
      entityId: company.id,
      metadata: req.body,
    });
    res.json(company);
  }),
);
