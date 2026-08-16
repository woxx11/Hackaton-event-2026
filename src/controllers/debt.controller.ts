import { Request, Response, NextFunction } from 'express';
import { createDebtService, getDebtsService, getDebtByIdService, updateDebtService, deleteDebtService } from '../services/debt.service';

export const createDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const debt = createDebtService(req.body);
    res.status(201).json(debt);
  } catch (error) {
    next(error);
  }
};

export const getDebts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getDebtsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const debt = getDebtByIdService(req.params.id, sellerId);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (error) {
    next(error);
  }
};

export const updateDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const debt = updateDebtService(req.params.id, sellerId, req.body);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (error) {
    next(error);
  }
};

export const deleteDebt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteDebtService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Debt not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
