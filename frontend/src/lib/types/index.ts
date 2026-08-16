export interface Seller {
  id: string;
  name: string;
  phone: string;
  shopName: string | null;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface LedgerProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface DebtItem {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: LedgerProduct;
}

export interface Payment {
  id: string;
  amount: string;
  paidAt: string;
}

export interface Debt {
  id: string;
  totalAmount: string;
  paidAmount: string;
  status: "OPEN" | "PARTIALLY_PAID" | "PAID";
  notes: string | null;
  createdAt: string;
  client: Client;
  items: DebtItem[];
  payments: Payment[];
}
