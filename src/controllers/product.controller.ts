import { Request, Response, NextFunction } from 'express';
import { createProductService, getProductsService, getProductByIdService, updateProductService, deleteProductService } from '../services/product.service';

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const result = getProductsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const product = getProductByIdService(req.params.id, sellerId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const product = updateProductService(req.params.id, sellerId, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteProductService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
