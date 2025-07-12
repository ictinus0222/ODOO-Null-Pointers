import express from 'express';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

// ✅ Confirm env vars are loading (important for debugging)
console.log('Cloudinary Config Check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Exists' : '❌ Missing'
});

// ✅ Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes); // Use only one path consistently
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Error handler (always after routes)
app.use(errorHandler);

export default app;
