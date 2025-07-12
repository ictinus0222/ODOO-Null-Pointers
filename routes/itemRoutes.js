import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';


const router = express.Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get('/', getAllItems);
router.get('/:id', getItemById);
//router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.post('/', protect, upload.single('image'), createItem);

export default router;
