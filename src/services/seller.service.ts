import { sellers } from '../data/sellers';
import { Seller } from '../types/seller.types';

export const registerSellerService = (data: Partial<Seller>): Seller => {
  const newSeller: Seller = {
    id: `seller_${Date.now()}`,
    phone: data.phone!,
    name: data.name!,
    password: data.password!,
    createdAt: new Date().toISOString(),
  };
  sellers.push(newSeller);
  return newSeller;
};

export const loginSellerService = (phone: string, password: string): Seller | undefined => {
  return sellers.find(s => s.phone === phone && s.password === password);
};

export const getSellerByIdService = (id: string): Seller | undefined => {
  return sellers.find(s => s.id === id);
};
