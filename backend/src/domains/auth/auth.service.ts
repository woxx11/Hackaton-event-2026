import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { hashPassword, verifyPassword } from "@/utils/password";
import { signAuthToken } from "@/utils/jwt";
import { DEFAULT_ROLES } from "@/utils/permissions";
import { recordAuditLog } from "@/lib/auditLog";
import { slugify } from "@/utils/slugify";
import type { RegisterCompanyInput, LoginInput } from "./auth.schema";

async function buildAuthResponse(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { role: true, company: true },
  });
  const token = signAuthToken({ userId: user.id, companyId: user.companyId, roleId: user.roleId });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      company: { id: user.company.id, name: user.company.name, slug: user.company.slug },
    },
  };
}

// Registers a brand-new tenant: Company, its default role set (seeded from
// the global permission catalog), a first Store, and the Owner user. This
// is the only place a Company is allowed to be created from the outside.
export async function registerCompany(input: RegisterCompanyInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw AppError.conflict("An account with this email already exists");
  }

  const permissions = await prisma.permission.findMany();
  if (permissions.length === 0) {
    throw AppError.internal("Permission catalog is not seeded. Run the database seed first.");
  }
  const permissionIdByKey = new Map(permissions.map((p) => [p.key, p.id]));

  const baseSlug = slugify(input.companyName);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const passwordHash = await hashPassword(input.password);

  const { userId, companyId } = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({ data: { name: input.companyName, slug } });

    const roles = await Promise.all(
      Object.entries(DEFAULT_ROLES).map(([name, keys]) =>
        tx.role.create({
          data: {
            companyId: company.id,
            name,
            isSystem: true,
            permissions: {
              create: keys
                .map((key) => permissionIdByKey.get(key))
                .filter((id): id is string => Boolean(id))
                .map((permissionId) => ({ permissionId })),
            },
          },
        }),
      ),
    );
    const ownerRole = roles.find((r) => r.name === "Owner")!;

    const store = await tx.store.create({
      data: { companyId: company.id, name: input.storeName, code: "MAIN" },
    });

    const user = await tx.user.create({
      data: {
        companyId: company.id,
        roleId: ownerRole.id,
        email: input.email,
        passwordHash,
        name: input.ownerName,
      },
    });

    await tx.employee.create({
      data: { companyId: company.id, userId: user.id, storeId: store.id, position: "Owner" },
    });

    return { userId: user.id, companyId: company.id };
  });

  await recordAuditLog({
    companyId,
    actorId: userId,
    action: "company.registered",
    entityType: "Company",
    entityId: companyId,
  });

  return buildAuthResponse(userId);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const validPassword = await verifyPassword(input.password, user.passwordHash);
  if (!validPassword) {
    throw AppError.unauthorized("Invalid email or password");
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  return buildAuthResponse(user.id);
}
