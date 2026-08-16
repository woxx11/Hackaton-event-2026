import { normalizePhone } from "../utils/phone.js";
import * as clientData from "../data/client.data.js";

export interface AddClientInput {
  phone: string;
  name: string;
}

// Finds the client by phone, creating an unclaimed record if this is a
// brand-new phone number, then links it to this seller's ledger. Safe to
// call again for a client the seller already has — the link is upserted.
export async function addClientToSeller(sellerId: string, input: AddClientInput) {
  const phone = normalizePhone(input.phone);
  const existing = await clientData.findClientByPhone(phone);
  const client = existing ?? (await clientData.createUnclaimedClient({ phone, name: input.name }));

  await clientData.linkSellerClient(sellerId, client.id);
  return client;
}

export async function listSellerClients(sellerId: string) {
  const links = await clientData.listClientsForSeller(sellerId);
  return links.map((link) => link.client);
}
