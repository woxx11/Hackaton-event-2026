import { AppError } from "../utils/AppError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/jwt.js";
import { normalizePhone } from "../utils/phone.js";
import * as clientData from "../data/client.data.js";

export interface RegisterClientInput {
  phone: string;
  password: string;
  name: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

function toPublicClient(client: { id: string; phone: string; name: string }) {
  return { id: client.id, phone: client.phone, name: client.name };
}

// A client's phone number may already exist in the system because a
// seller added them as a debtor before they ever registered. Registering
// with that same phone "claims" the existing record (sets the password)
// instead of failing — but if the account is already claimed, duplicate
// registration is rejected, per the "one phone, one account" rule.
export async function registerClient(input: RegisterClientInput) {
  const phone = normalizePhone(input.phone);
  const existing = await clientData.findClientByPhone(phone);

  if (existing?.passwordHash) {
    throw AppError.conflict("Bu telefon raqam bilan mijoz allaqachon ro'yxatdan o'tgan");
  }

  const passwordHash = await hashPassword(input.password);
  const client = existing
    ? await clientData.claimClient(existing.id, passwordHash, input.name)
    : await clientData.createClient({ phone, passwordHash, name: input.name });

  const token = signAuthToken({ id: client.id, role: "CLIENT" });
  return { token, client: toPublicClient(client) };
}

export async function loginClient(input: LoginInput) {
  const phone = normalizePhone(input.phone);
  const client = await clientData.findClientByPhone(phone);
  if (!client?.passwordHash) throw AppError.unauthorized("Telefon raqam yoki parol noto'g'ri");

  const valid = await verifyPassword(input.password, client.passwordHash);
  if (!valid) throw AppError.unauthorized("Telefon raqam yoki parol noto'g'ri");

  const token = signAuthToken({ id: client.id, role: "CLIENT" });
  return { token, client: toPublicClient(client) };
}

export async function getClientProfile(clientId: string) {
  const client = await clientData.findClientById(clientId);
  if (!client) throw AppError.notFound("Client not found");
  return toPublicClient(client);
}
