import express from 'express';
import { addOrderItems, getOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(addOrderItems)                     // Public access for guest checkout
  .get(protect, adminOnly, getOrders);     // Admin access to view orders

export default router;
