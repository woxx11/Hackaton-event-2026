// Central permission catalog. Keys are "<domain>.<action>".
// This is the single source of truth for both the seed script (which
// creates Permission rows + default Role→Permission mappings) and any
// runtime checks that reference a permission key.

export const PERMISSIONS = {
  // companies
  COMPANY_MANAGE: "companies.manage",
  // stores / warehouses
  STORE_MANAGE: "stores.manage",
  WAREHOUSE_MANAGE: "warehouses.manage",
  // users / employees / roles
  USER_MANAGE: "users.manage",
  EMPLOYEE_MANAGE: "employees.manage",
  ROLE_MANAGE: "roles.manage",
  // catalog
  PRODUCT_VIEW: "products.view",
  PRODUCT_MANAGE: "products.manage",
  // inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_ADJUST: "inventory.adjust",
  INVENTORY_TRANSFER: "inventory.transfer",
  // purchasing
  PURCHASE_ORDER_MANAGE: "purchase_orders.manage",
  // sales
  SALE_CREATE: "sales.create",
  SALE_VIEW: "sales.view",
  SALE_VOID: "sales.void",
  REFUND_CREATE: "refunds.create",
  // customers / loyalty / marketing
  CUSTOMER_VIEW: "customers.view",
  CUSTOMER_MANAGE: "customers.manage",
  LOYALTY_MANAGE: "loyalty.manage",
  MARKETING_MANAGE: "marketing.manage",
  AUTOMATION_MANAGE: "automations.manage",
  // analytics / AI
  ANALYTICS_VIEW: "analytics.view",
  AI_USE: "ai.use",
  AI_APPROVE_ACTION: "ai.approve_action",
  // audit
  AUDIT_LOG_VIEW: "audit_logs.view",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);

// Default system roles seeded for every new company.
export const DEFAULT_ROLES: Record<string, PermissionKey[]> = {
  Owner: ALL_PERMISSIONS,
  Manager: [
    PERMISSIONS.STORE_MANAGE,
    PERMISSIONS.WAREHOUSE_MANAGE,
    PERMISSIONS.EMPLOYEE_MANAGE,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.PURCHASE_ORDER_MANAGE,
    PERMISSIONS.SALE_CREATE,
    PERMISSIONS.SALE_VIEW,
    PERMISSIONS.SALE_VOID,
    PERMISSIONS.REFUND_CREATE,
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.CUSTOMER_MANAGE,
    PERMISSIONS.LOYALTY_MANAGE,
    PERMISSIONS.MARKETING_MANAGE,
    PERMISSIONS.AUTOMATION_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_APPROVE_ACTION,
    PERMISSIONS.AUDIT_LOG_VIEW,
  ],
  Cashier: [
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.SALE_CREATE,
    PERMISSIONS.SALE_VIEW,
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.CUSTOMER_MANAGE,
    PERMISSIONS.AI_USE,
  ],
  InventoryClerk: [
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.PURCHASE_ORDER_MANAGE,
    PERMISSIONS.AI_USE,
  ],
};
