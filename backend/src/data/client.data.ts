import { id, memory, now } from "./memoryStore.js";
export async function findClientByPhone(phone: string) { return memory.clients.find((client) => client.phone === phone) ?? null; }
export async function findClientById(clientId: string) { return memory.clients.find((client) => client.id === clientId) ?? null; }
export async function createClient(data: { phone: string; passwordHash: string; name: string }) { const created = { id: id(), ...data, createdAt: now(), updatedAt: now() }; memory.clients.push(created); return created; }
export async function createUnclaimedClient(data: { phone: string; name: string }) { const created = { id: id(), ...data, passwordHash: null, createdAt: now(), updatedAt: now() }; memory.clients.push(created); return created; }
export async function claimClient(clientId: string, passwordHash: string, name: string) { const client = memory.clients.find((item) => item.id === clientId)!; client.passwordHash = passwordHash; client.name = name; client.updatedAt = now(); return client; }
export async function linkSellerClient(sellerId: string, clientId: string) { let link = memory.links.find((item) => item.sellerId === sellerId && item.clientId === clientId); if (!link) { link = { sellerId, clientId, createdAt: now() }; memory.links.push(link); } return link; }
export async function findSellerClientLink(sellerId: string, clientId: string) { return memory.links.find((item) => item.sellerId === sellerId && item.clientId === clientId) ?? null; }
export async function listClientsForSeller(sellerId: string) { return memory.links.filter((link) => link.sellerId === sellerId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((link) => ({ ...link, client: memory.clients.find((client) => client.id === link.clientId)! })); }
