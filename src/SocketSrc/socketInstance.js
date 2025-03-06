import http from 'http';
import { Server } from 'socket.io';
import { EmitServices } from '../serviceSrc/SocketServices/socketServices.js';
import Rooms from './models/roomModel.js';
import SocketChatServiceController from './services/chat_services.js';
import CustomerSocketChatServiceController from './services/customer_chat_services.js';
import NormalRooms from './models/normalRoomModel.js';

export function createSocketServer(httpServer) {
  const socketServiceChatController = new SocketChatServiceController();

  const customerSocketServiceChatController =
    new CustomerSocketChatServiceController();

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('connected', () => {
      console.log('connected to my system');

      // this is to connect to my system

      socket.emit('connected-user', 'connected');
    });

    socket.on('connect-to-services', async () => {
      await EmitServices();
    });

    // sending message to rooms
    socket.on(
      'message-room',
      async (
        room,
        content,
        sender,
        time,
        date,
        image,
        imageDetails,
        products,
        product_details,
        totalPrice,
        symbol
      ) => {
        await socketServiceChatController.Message(
          room,
          content,
          sender,
          time,
          date,
          image,
          imageDetails,
          products,
          product_details,
          totalPrice,
          symbol,
          socket
        );
      }
    );

    socket.on('create-user', async (details) => {
      await socketServiceChatController.Create_Room(details);
    });

    // this is to join room
    socket.on('join-room', async (room, previousRoom, roomDetails) => {
      await socketServiceChatController.Join_Room(
        room,
        previousRoom,
        roomDetails,
        socket
      );
    });

    socket.on('customer-new-order', async (details) => {
      const members = await Rooms.find({
        room: { $regex: details.id ? details.id : '', $options: 'i' },
      }).sort('-lastTime');

      io.emit('new-user', members);
    });

    socket.on('new-user', async () => {
      const members = await Rooms.find().sort('-lastTime');

      io.emit('new-user', members);
    });

    socket.on('admin-join-room', async (room, previousRoom, roomDetails) => {
      await socketServiceChatController.Join_Normal_Room(
        room,
        previousRoom,
        roomDetails,
        socket
      );
    });

    // sending message to rooms
    socket.on(
      'admin-message-room',
      async (room, content, sender, time, date, image, imageDetails) => {
        await socketServiceChatController.AdminMessage(
          room,
          content,
          sender,
          time,
          date,
          image,
          imageDetails,
          socket
        );
      }
    );

    socket.on('update_selection_state', async (status, room) => {
      await socketServiceChatController.UpdateSelectionState(
        status,
        room,
        socket
      );
    });

    // this is to create room
    socket.on('create-customer-user', async (details) => {
      await customerSocketServiceChatController.Create_Customer_Room(details);
    });

    // sending message to rooms
    socket.on(
      'customer-message-room',
      async (room, content, sender, time, date, image, imageDetails) => {
        await customerSocketServiceChatController.CustomerMessage(
          room,
          content,
          sender,
          time,
          date,
          image,
          imageDetails,
          socket
        );
      }
    );

    socket.on('my-customer-new-user', async (details) => {
      const members = await NormalRooms.find({
        room: `user-${details.id}-admin`,
      }).sort('-lastTime');

      io.emit('normal-new-user', members);
    });

    // this is to join room
    socket.on('customer-join-room', async (room, previousRoom, roomDetails) => {
      await customerSocketServiceChatController.Customer_Join_Room(
        room,
        previousRoom,
        roomDetails,
        socket
      );
    });

    // sending message to rooms
    socket.on(
      'customer-admin-message-room',
      async (room, content, sender, time, date, image, imageDetails) => {
        await customerSocketServiceChatController.CustomerAdminMessage(
          room,
          content,
          sender,
          time,
          date,
          image,
          imageDetails,
          socket
        );
      }
    );

    socket.on(
      'customer-admin-join-room',
      async (room, previousRoom, roomDetails) => {
        await customerSocketServiceChatController.Customer_Join_Normal_Room(
          room,
          previousRoom,
          roomDetails,
          socket
        );
      }
    );
  });

  // Add your socket event handlers here (explained later)

  return io;
}
