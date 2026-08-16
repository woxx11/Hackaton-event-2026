import { Request, Response, NextFunction } from 'express';
import { createClientService, getClientsService, getClientByIdService, updateClientService, deleteClientService } from '../services/client.service';

export const createClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = createClientService(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const getClients = (req: Request, res: Response, next: NextFunction) => {
  try {
    // In future, get sellerId from req.user
    const sellerId = req.query.sellerId as string;
    const result = getClientsService(sellerId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const client = getClientByIdService(req.params.id, sellerId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const client = updateClientService(req.params.id, sellerId, req.body);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.query.sellerId as string;
    const success = deleteClientService(req.params.id, sellerId);
    if (!success) return res.status(404).json({ message: 'Client not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
