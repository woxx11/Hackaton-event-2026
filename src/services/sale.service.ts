import { sales } from '../data/sales';
import { Sale } from '../types/sale.types';

export const createSaleService = (data: Partial<Sale>): Sale => {
  const newSale: Sale = {
    id: `sale_${Date.now()}`,
    sellerId: data.sellerId!,
    clientId: data.clientId!,
    productId: data.productId!,
    quantity: data.quantity!,
    totalPrice: data.totalPrice!,
    createdAt: new Date().toISOString(),
  };
  sales.push(newSale);
  // Optional: Add logic to update product stock and handle debt if not fully paid
  return newSale;
};

export const getSalesService = (sellerId: string): Sale[] => {
  return sales.filter(s => s.sellerId === sellerId);
};

export const getSaleByIdService = (id: string, sellerId: string): Sale | undefined => {
  return sales.find(s => s.id === id && s.sellerId === sellerId);
};
