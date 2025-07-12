import express from 'express';
import { getAllUsers, getAllOrders,approveItem,getPendingItems,rejectItem,adminDeleteItem} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/orders', protect, adminOnly, getAllOrders);
router.get('/pending-items', protect, adminOnly, getPendingItems);
router.put('/approve-item/:id', protect, adminOnly, approveItem);
router.put('/reject-item/:id', protect, adminOnly, rejectItem);
router.delete('/delete-item/:id', protect, adminOnly, adminDeleteItem);

export default router;
