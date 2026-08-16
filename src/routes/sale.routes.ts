import { Router } from 'express';
import { createSale, getSales, getSale } from '../controllers/sale.controller';

const router = Router();

router.post('/', createSale);
router.get('/', getSales);
router.get('/:id', getSale);

export default router;
