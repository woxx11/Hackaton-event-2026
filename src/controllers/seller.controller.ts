import { Request, Response } from "express";
import {
  createSeller,
  findSellerByPhone,
} from "../services/seller.service";

export const registerSeller = (req: Request, res: Response) => {
  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    return res.status(400).json({
      message: "Telefon, ism va parol majburiy",
    });
  }

  const existingSeller = findSellerByPhone(phone);

  if (existingSeller) {
    return res.status(409).json({
      message: "Bu telefon raqami allaqachon ro'yxatdan o'tgan",
    });
  }

  const seller = createSeller(phone, name, password);

  return res.status(201).json({
    message: "Seller muvaffaqiyatli ro'yxatdan o'tdi",
    seller: {
      id: seller.id,
      phone: seller.phone,
      name: seller.name,
      createdAt: seller.createdAt,
    },
  });
};

export const getSellerByPhone = (req: Request, res: Response) => {
  const { phone } = req.params;

  const seller = findSellerByPhone(phone);

  if (!seller) {
    return res.status(404).json({
      message: "Seller topilmadi",
    });
  }

  return res.json({
    id: seller.id,
    phone: seller.phone,
    name: seller.name,
    createdAt: seller.createdAt,
  });
};