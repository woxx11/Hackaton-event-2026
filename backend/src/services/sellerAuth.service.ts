import { AppError } from "../utils/AppError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/jwt.js";
import { normalizePhone } from "../utils/phone.js";
import * as sellerData from "../data/seller.data.js";

export interface RegisterSellerInput {
  phone: string;
  password: string;
  name: string;
  shopName?: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

function toPublicSeller(seller: { id: string; phone: string; name: string; shopName: string | null }) {
  return { id: seller.id, phone: seller.phone, name: seller.name, shopName: seller.shopName };
}

export async function registerSeller(input: RegisterSellerInput) {
  const phone = normalizePhone(input.phone);

  const existing = await sellerData.findSellerByPhone(phone);
  if (existing) {
    throw AppError.conflict("Bu telefon raqam bilan sotuvchi allaqachon ro'yxatdan o'tgan");
  }

  const passwordHash = await hashPassword(input.password);
  const seller = await sellerData.createSeller({
    phone,
    passwordHash,
    name: input.name,
    shopName: input.shopName,
  });

  const token = signAuthToken({ id: seller.id, role: "SELLER" });
  return { token, seller: toPublicSeller(seller) };
}

export async function loginSeller(input: LoginInput) {
  const phone = normalizePhone(input.phone);
  const seller = await sellerData.findSellerByPhone(phone);
  if (!seller) throw AppError.unauthorized("Telefon raqam yoki parol noto'g'ri");

  const valid = await verifyPassword(input.password, seller.passwordHash);
  if (!valid) throw AppError.unauthorized("Telefon raqam yoki parol noto'g'ri");

  const token = signAuthToken({ id: seller.id, role: "SELLER" });
  return { token, seller: toPublicSeller(seller) };
}

export async function getSellerProfile(sellerId: string) {
  const seller = await sellerData.findSellerById(sellerId);
  if (!seller) throw AppError.notFound("Seller not found");
  return toPublicSeller(seller);
}
