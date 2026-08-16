import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { verifyAuthToken } from "@/utils/jwt";
import type { PermissionKey } from "@/utils/permissions";

// Verifies the bearer JWT, then re-loads the user's role/permissions from
// the database on every request. This is intentionally not "trust the
// token" for authorization data — a revoked user or a role whose
// permissions changed 30 seconds ago must take effect immediately.
export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw AppError.unauthorized();
  }

  const token = header.slice("Bearer ".length);
  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    throw AppError.unauthorized("Invalid or expired session");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });

  if (!user || !user.isActive || user.companyId !== payload.companyId) {
    throw AppError.unauthorized("Invalid or expired session");
  }

  req.auth = {
    userId: user.id,
    companyId: user.companyId,
    roleId: user.roleId,
    roleName: user.role.name,
    permissions: new Set(user.role.permissions.map((rp) => rp.permission.key as PermissionKey)),
  };

  next();
});

// Enforces RBAC: the authenticated user's role must carry every listed
// permission. Combined with requireAuth, this is what stands between an
// API route and "any logged-in user can do anything."
export const requirePermission =
  (...permissions: PermissionKey[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw AppError.unauthorized();
    }
    const missing = permissions.filter((p) => !req.auth!.permissions.has(p));
    if (missing.length > 0) {
      throw AppError.forbidden(`Missing permission(s): ${missing.join(", ")}`);
    }
    next();
  };
