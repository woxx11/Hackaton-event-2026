import { Router } from 'express';
import { registerSeller, loginSeller, getSeller, getSellerProfile } from '../controllers/seller.controller';

const router = Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/:id', getSeller);
router.get('/:id/profile', getSellerProfile);

export default router;
