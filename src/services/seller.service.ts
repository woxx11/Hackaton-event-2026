import { sellers, Seller } from "../data/sellers.js";

export const findSellerByPhone = (phone: string): Seller | undefined => {
  return sellers.find((seller) => seller.phone === phone);
};

export const createSeller = (
  phone: string,
  name: string,
  password: string
): Seller => {
  const newSeller: Seller = {
    id: `seller_${Date.now()}`,
    phone,
    name,
    password,
    createdAt: new Date().toISOString(),
  };

  sellers.push(newSeller);

  return newSeller;
};