import { products } from '../data/products';
import { Product } from '../types/product.types';

export const createProductService = (data: Partial<Product>): Product => {
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    sellerId: data.sellerId!,
    name: data.name!,
    price: data.price!,
    stock: data.stock!,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return newProduct;
};

export const getProductsService = (sellerId: string): Product[] => {
  return products.filter(p => p.sellerId === sellerId);
};

export const getProductByIdService = (id: string, sellerId: string): Product | undefined => {
  return products.find(p => p.id === id && p.sellerId === sellerId);
};

export const updateProductService = (id: string, sellerId: string, data: Partial<Product>): Product | undefined => {
  const index = products.findIndex(p => p.id === id && p.sellerId === sellerId);
  if (index !== -1) {
    products[index] = { ...products[index], ...data };
    return products[index];
  }
  return undefined;
};

export const deleteProductService = (id: string, sellerId: string): boolean => {
  const index = products.findIndex(p => p.id === id && p.sellerId === sellerId);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
};
