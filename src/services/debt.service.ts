import { debts } from '../data/debts';
import { Debt } from '../types/debt.types';

export const createDebtService = (data: Partial<Debt>): Debt => {
  const newDebt: Debt = {
    id: `debt_${Date.now()}`,
    sellerId: data.sellerId!,
    clientId: data.clientId!,
    amount: data.amount!,
    dueDate: data.dueDate!,
    isPaid: data.isPaid || false,
    createdAt: new Date().toISOString(),
  };
  debts.push(newDebt);
  return newDebt;
};

export const getDebtsService = (sellerId: string): Debt[] => {
  return debts.filter(d => d.sellerId === sellerId);
};

export const getDebtByIdService = (id: string, sellerId: string): Debt | undefined => {
  return debts.find(d => d.id === id && d.sellerId === sellerId);
};

export const updateDebtService = (id: string, sellerId: string, data: Partial<Debt>): Debt | undefined => {
  const index = debts.findIndex(d => d.id === id && d.sellerId === sellerId);
  if (index !== -1) {
    debts[index] = { ...debts[index], ...data };
    return debts[index];
  }
  return undefined;
};

export const deleteDebtService = (id: string, sellerId: string): boolean => {
  const index = debts.findIndex(d => d.id === id && d.sellerId === sellerId);
  if (index !== -1) {
    debts.splice(index, 1);
    return true;
  }
  return false;
};
