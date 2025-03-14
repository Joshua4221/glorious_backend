import { socketIO } from '../../../index.js';
import NormalMessage from '../models/normalMessageModel.js';
import NormalRooms from '../models/normalRoomModel.js';
import moment from 'moment';
import {
  getLastMessagesFromNormalRoom,
  sortNormalRoomMessagesByDate,
} from '../socket_utils.js';

export default class CustomerSocketChatServiceController {
  async Create_Customer_Room(details) {
    try {
      const checkforRoom = await NormalRooms.findOne({ room: details.room });

      if (checkforRoom) {
        const members = await NormalRooms.find({ room: details.room }).sort(
          '-lastTime'
        );

        socketIO.emit('total-customer-user', members);
      } else {
        const newUser = await NormalRooms.create(details);

        const members = await NormalRooms.find({ room: details.room }).sort(
          '-lastTime'
        );
        socketIO.emit('total-customer-user', members);
      }
    } catch (err) {
      throw err.message;
    }
  }

  async Customer_Join_Room(room, previousRoom, roomDetails, socket) {
    if (previousRoom) {
      socket.leave(previousRoom);
    }

    socket.join(room);

    if (roomDetails?.client_notification > 0) {
      const notification = await NormalRooms.findOne({
        room: room,
      });

      notification.client_notification = 0;

      await notification.save();

      const members = await NormalRooms.find({ room: room }).sort('-lastTime');

      socket.emit('normal-new-user', members);
    }

    let roomMessages = await getLastMessagesFromNormalRoom(room);
    roomMessages = await sortNormalRoomMessagesByDate(roomMessages);

    socket.emit('normal-room-messages', roomMessages);
  }

  async Customer_Join_Normal_Room(room, previousRoom, roomDetails, socket) {
    if (previousRoom) {
      socket.leave(previousRoom);
    }

    socket.join(room);

    if (roomDetails?.notification > 0) {
      const notification = await NormalRooms.findOne({
        room: room,
      });

      notification.notification = 0;

      await notification.save();

      const members = await NormalRooms.find().sort('-lastTime');

      socket.emit('normal-new-users', members);
    }

    let roomMessages = await getLastMessagesFromNormalRoom(room);
    roomMessages = await sortNormalRoomMessagesByDate(roomMessages);
    socket.emit('normal-room-messages', roomMessages);
  }

  async CustomerAdminMessage(
    room,
    content,
    sender,
    time,
    date,
    image,
    imageDetails,
    socket
  ) {
    try {
      if (image) {
        await NormalMessage.create({
          content,
          from: sender,
          time,
          date,
          to: room,
          image: image,
          imageDetails: imageDetails,
        });
      } else {
        await NormalMessage.create({
          content,
          from: sender,
          time,
          date,
          to: room,
        });
      }

      let roomMessages = await getLastMessagesFromNormalRoom(room);

      roomMessages = await sortNormalRoomMessagesByDate(roomMessages);

      socketIO.to(room).emit('normal-room-messages', roomMessages);

      let notification = await NormalRooms.findOne({
        room: room,
      });

      notification.notification = 0;

      if (notification?.client_notification) {
        notification.client_notification =
          notification?.client_notification + 1;

        notification.lastTime = moment().format();

        await notification.save();

        const members = await NormalRooms.find({ room: room }).sort(
          '-lastTime'
        );
        const members_admin = await NormalRooms.find().sort('-lastTime');

        socketIO.to(room).emit('normal-new-user', members);
        socketIO.to(room).emit('normal-new-users', members_admin);
      } else {
        notification.client_notification = 1;

        notification.lastTime = moment().format();

        await notification.save();

        const members = await NormalRooms.find({ room: room }).sort(
          '-lastTime'
        );
        const members_admin = await NormalRooms.find().sort('-lastTime');

        socketIO.to(room).emit('normal-new-user', members);
        socketIO.to(room).emit('normal-new-users', members_admin);
      }
    } catch (error) {
      console.log(error, 'seaoanf of work');
    }
  }

  async CustomerMessage(
    room,
    content,
    sender,
    time,
    date,
    image,
    imageDetails,
    socket
  ) {
    try {
      if (image) {
        await NormalMessage.create({
          content,
          from: sender,
          time,
          date,
          to: room,
          image: image,
          imageDetails: imageDetails,
        });
      } else {
        await NormalMessage.create({
          content,
          from: sender,
          time,
          date,
          to: room,
        });
      }

      let roomMessages = await getLastMessagesFromNormalRoom(room);

      roomMessages = await sortNormalRoomMessagesByDate(roomMessages);

      socketIO.to(room).emit('normal-room-messages', roomMessages);

      let notification = await NormalRooms.findOne({
        room: room,
      });

      notification.client_notification = 0;

      if (notification?.notification) {
        notification.notification = notification?.notification + 1;

        notification.lastTime = moment().format();

        await notification.save();

        const members = await NormalRooms.find({ room: room }).sort(
          '-lastTime'
        );
        const members_admin = await NormalRooms.find().sort('-lastTime');

        socketIO.to(room).emit('normal-new-user', members);
        socketIO.to(room).emit('normal-new-users', members_admin);
      } else {
        notification.notification = 1;

        notification.lastTime = moment().format();

        await notification.save();

        const members = await NormalRooms.find({ room: room }).sort(
          '-lastTime'
        );
        const members_admin = await NormalRooms.find().sort('-lastTime');

        socketIO.to(room).emit('normal-new-user', members);
        socketIO.to(room).emit('normal-new-users', members_admin);
      }
    } catch (error) {
      console.log(error, 'sosj');
    }
  }
}
