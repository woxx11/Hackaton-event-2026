export interface Debt {
  id: string;
  sellerId: string;
  clientId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  createdAt: string;
}
