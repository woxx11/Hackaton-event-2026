import { Router } from "express";
import {
  registerSeller,
  getSellerByPhone,
} from "../controllers/seller.controller";

const router = Router();

router.post("/register", registerSeller);
router.get("/:phone", getSellerByPhone);

export default router;