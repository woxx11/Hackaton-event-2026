import { Request, Response, NextFunction } from 'express';
import { createSaleService, getSalesService, getSaleByIdService } from '../services/sale.service';

export const createSale = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = createSaleService(req.body);
    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

export const getSales = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getSalesService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getSale = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const sale = getSaleByIdService(req.params.id, sellerId);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    next(error);
  }
};
