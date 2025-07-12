// middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
    console.error('[❌ Error Middleware]', err.stack || err.message || err);
  
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  }
  