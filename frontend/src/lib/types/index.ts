export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  company: { id: string; name: string; slug: string };
}

export interface Store {
  id: string;
  name: string;
  code: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Brand {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string | null;
  name: string | null;
  attributes: Record<string, string>;
  price: string;
  cost: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  brandId: string | null;
  category: Category | null;
  brand: Brand | null;
  variants: ProductVariant[];
  isActive: boolean;
}

export interface InventoryRow {
  id: string;
  productVariantId: string;
  storeId: string | null;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  isLowStock: boolean;
  productVariant: ProductVariant & { product: { id: string; name: string } };
  store: Store | null;
}

export interface ReorderRecommendation {
  productVariantId: string;
  sku: string;
  productName: string;
  storeId: string | null;
  storeName: string | null;
  quantityOnHand: number;
  reorderPoint: number;
  dailyVelocity: number;
  daysUntilStockout: number | null;
  suggestedReorderQuantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  loyaltyAccount: { id: string; points: number; tier: string } | null;
  createdAt: string;
}

export interface Sale {
  id: string;
  status: "COMPLETED" | "VOID" | "REFUNDED" | "PARTIALLY_REFUNDED";
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  notes: string | null;
  createdAt: string;
  customer: Customer | null;
  store: Store;
  employee: { id: string; user: { name: string } };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    productVariant: ProductVariant & { product: { id: string; name: string } };
  }>;
  payments: Array<{ id: string; method: string; amount: string }>;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}
