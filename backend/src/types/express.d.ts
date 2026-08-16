import type { PermissionKey } from "@/utils/permissions";

export interface AuthContext {
  userId: string;
  companyId: string;
  roleId: string;
  roleName: string;
  permissions: Set<PermissionKey>;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
