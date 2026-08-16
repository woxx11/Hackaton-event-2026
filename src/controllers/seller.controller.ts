import { Request, Response, NextFunction } from 'express';
import { registerSellerService, loginSellerService, getSellerByIdService } from '../services/seller.service';

export const registerSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = registerSellerService(req.body);
    const { password, ...sellerWithoutPassword } = seller;
    res.status(201).json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const loginSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password } = req.body;
    const seller = loginSellerService(phone, password);
    if (!seller) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { password: _, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = getSellerByIdService(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getSellerProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = getSellerByIdService(req.params.id); // For now, passing ID
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const { password, ...sellerWithoutPassword } = seller;
    res.json(sellerWithoutPassword);
  } catch (error) {
    next(error);
  }
};
