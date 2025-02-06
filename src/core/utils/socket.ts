import { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import logger from './logger';

let io: Server;

export const initializeServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket: Socket) => {
    logger.info(`⚡ User connected: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`❌ User disconnected: ${socket.id}`);
    });
  });
};

export const getSocketInstance = () => io;
