import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import * as authService from "./auth.service";

export const registerCompanyHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerCompany(req.body);
  res.status(201).json(result);
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw AppError.unauthorized();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.auth.userId },
    include: { role: true, company: true },
  });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    permissions: Array.from(req.auth.permissions),
    company: { id: user.company.id, name: user.company.name, slug: user.company.slug },
  });
});
