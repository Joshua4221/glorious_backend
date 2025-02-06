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
  const port = '4300';

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
