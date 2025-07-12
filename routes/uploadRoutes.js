import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Set up multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protected image upload route
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
