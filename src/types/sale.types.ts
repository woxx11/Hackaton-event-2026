export interface Sale {
  id: string;
  sellerId: string;
  clientId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}
