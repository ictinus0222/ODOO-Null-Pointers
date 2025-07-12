import mongoose from 'mongoose';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log('User connected to socket');
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});
