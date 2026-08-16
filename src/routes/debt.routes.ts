import { Router } from 'express';
import { createDebt, getDebts, getDebt, updateDebt, deleteDebt } from '../controllers/debt.controller';

const router = Router();

router.post('/', createDebt);
router.get('/', getDebts);
router.get('/:id', getDebt);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);

export default router;
