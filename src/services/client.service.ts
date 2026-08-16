import { clients } from '../data/clients';
import { Client } from '../types/client.types';

export const createClientService = (data: Partial<Client>): Client => {
  const newClient: Client = {
    id: `client_${Date.now()}`,
    sellerId: data.sellerId!,
    name: data.name!,
    phone: data.phone!,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  return newClient;
};

export const getClientsService = (sellerId: string): Client[] => {
  return clients.filter(c => c.sellerId === sellerId);
};

export const getClientByIdService = (id: string, sellerId: string): Client | undefined => {
  return clients.find(c => c.id === id && c.sellerId === sellerId);
};

export const updateClientService = (id: string, sellerId: string, data: Partial<Client>): Client | undefined => {
  const index = clients.findIndex(c => c.id === id && c.sellerId === sellerId);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...data };
    return clients[index];
  }
  return undefined;
};

export const deleteClientService = (id: string, sellerId: string): boolean => {
  const index = clients.findIndex(c => c.id === id && c.sellerId === sellerId);
  if (index !== -1) {
    clients.splice(index, 1);
    return true;
  }
  return false;
};
