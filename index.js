import express from 'express';
import { expressApp } from './express_app.js';
import { configs } from './config/index.js';
import dotenv from 'dotenv';
import { connect_db } from './db/connect.js';
import { createSocketServer } from './src/SocketSrc/socketInstance.js';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = createSocketServer(server);

const StartServer = async () => {
  const { PORT } = configs;
  const port = '7700';

  dotenv.config();

  await connect_db();

  await expressApp(app);

  server
    .listen(PORT || port, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();

export const socketIO = io;

// My own
// MONGODB_URI=mongodb+srv://Godfirst:joshua1212@nodeexpressproject.b2bha.mongodb.net/Glorious_Evidence?retryWrites=true&w=majority

// glrious
// MONGODB_URI=mongodb+srv://gloriousevidenceltd:Glorious1212@cluster0.luyw9yr.mongodb.net/Glorious_Evidence?retryWrites=true&w=majority
