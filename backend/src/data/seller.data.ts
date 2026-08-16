import { id, memory, now } from "./memoryStore.js";
export async function findSellerByPhone(phone: string) { return memory.sellers.find((seller) => seller.phone === phone) ?? null; }
export async function findSellerById(sellerId: string) { return memory.sellers.find((seller) => seller.id === sellerId) ?? null; }
export async function createSeller(data: { phone: string; passwordHash: string; name: string; shopName?: string }) { const created = { id: id(), ...data, shopName: data.shopName ?? null, createdAt: now(), updatedAt: now() }; memory.sellers.push(created); return created; }
