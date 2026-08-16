import { AppError } from "../utils/AppError.js";
import * as productData from "../data/product.data.js";

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export function createProduct(sellerId: string, input: CreateProductInput) {
  return productData.createProduct({ sellerId, ...input });
}

export function listProducts(sellerId: string) {
  return productData.listProductsForSeller(sellerId);
}

export async function updateProduct(sellerId: string, productId: string, input: UpdateProductInput) {
  const existing = await productData.findProductByIdForSeller(productId, sellerId);
  if (!existing) throw AppError.notFound("Mahsulot topilmadi");
  return productData.updateProduct(productId, input);
}
