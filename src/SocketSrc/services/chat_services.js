import moment from 'moment';
import { socketIO } from '../../../index.js';
import Message from '../models/messageModel.js';
import Rooms from '../models/roomModel.js';
import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from '../socket_utils.js';
import OrderController from '../../orderSrc/orderServices/order_services.js';
import OrderModel from '../../orderSrc/orderModel/order_model.js';

export default class SocketChatServiceController {
  constructor() {
    this.orderService = new OrderController();
  }

  async Create_Room(details) {
    try {
      console.log(details, 'lord of work');
      const checkforRoom = await Rooms.findOne({ room: details.room });

      if (checkforRoom) {
        const members = await Rooms.find().sort('-lastTime');

        socketIO.emit('total-user', members);
      } else {
        const newUser = await Rooms.create(details);

        const members = await Rooms.find().sort('-lastTime');

        socketIO.emit('total-user', members);
      }
    } catch (err) {
      throw err.message;
    }
  }

  async Join_Room(room, previousRoom, roomDetails, socket) {
    if (previousRoom) {
      socket.leave(previousRoom);
    }

    socket.join(room);

    if (roomDetails?.client_notification > 0) {
      const notification = await Rooms.findOne({
        room: room,
      });

      notification.client_notification = 0;

      await notification.save();

      const members = await Rooms.find().sort('-lastTime');

      socket.emit('new-user', members);
    }

    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = await sortRoomMessagesByDate(roomMessages);

    socket.emit('room-messages', roomMessages);
  }

  async Join_Normal_Room(room, previousRoom, roomDetails, socket) {
    if (previousRoom) {
      socket.leave(previousRoom);
    }

    console.log(room, 'room');

    socket.join(room);

    if (roomDetails?.notification > 0) {
      const notification = await Rooms.findOne({
        room: room,
      });

      notification.notification = 0;

      await notification.save();

      const members = await Rooms.find().sort('-lastTime');

      socket.emit('new-user', members);
    }

    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = await sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages);
  }

  async AdminMessage(
    room,
    content,
    sender,
    time,
    date,
    image,
    imageDetails,
    socket
  ) {
    if (image) {
      await Message.create({
        content,
        from: sender,
        time,
        date,
        to: room,
        image: image,
        imageDetails: imageDetails,
      });
    } else {
      await Message.create({
        content,
        from: sender,
        time,
        date,
        to: room,
      });
    }

    let roomMessages = await getLastMessagesFromRoom(room);

    roomMessages = await sortRoomMessagesByDate(roomMessages);

    socketIO.to(room).emit('room-messages', roomMessages);

    let notification = await Rooms.findOne({
      room: room,
    });

    let admin_order = await OrderModel.findOne({ _id: room?.split('-')[0] });

    notification.notification = 0;

    admin_order.admin_notification = 0;

    if (notification?.client_notification) {
      notification.client_notification = notification?.client_notification + 1;

      admin_order.client_notification = admin_order.client_notification + 1;

      notification.lastTime = moment().format();

      await notification.save();

      await admin_order.save();

      const members = await Rooms.find().sort('-lastTime');

      socketIO.to(room).emit('new-user', members);
    } else {
      notification.client_notification = 1;

      admin_order.client_notification = 1;

      notification.lastTime = moment().format();

      await notification.save();

      await admin_order.save();

      const members = await Rooms.find().sort('-lastTime');

      socketIO.to(room).emit('new-user', members);
    }
  }

  async Message(
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
  ) {
    if (image) {
      await Message.create({
        content,
        from: sender,
        time,
        date,
        to: room,
        image: image,
        imageDetails: imageDetails,
        products: products,
        product_details: product_details,
        totalPrice,
        symbol,
      });
    } else {
      await Message.create({
        content,
        from: sender,
        time,
        date,
        to: room,
        products: products,
        product_details: product_details,
        totalPrice,
        symbol,
      });
    }

    let roomMessages = await getLastMessagesFromRoom(room);

    roomMessages = await sortRoomMessagesByDate(roomMessages);

    socketIO.to(room).emit('room-messages', roomMessages);

    let notification = await Rooms.findOne({
      room: room,
    });

    let client_order = await OrderModel.findOne({ _id: room?.split('-')[0] });

    notification.client_notification = 0;

    client_order.client_notification = 0;

    if (notification?.notification) {
      notification.notification = notification?.notification + 1;

      client_order.admin_notification = client_order.admin_notification + 1;

      notification.lastTime = moment().format();

      await notification.save();

      await client_order.save();

      const members = await Rooms.find().sort('-lastTime');

      socketIO.to(room).emit('new-user', members);
    } else {
      notification.notification = 1;

      client_order.admin_notification = 1;

      notification.lastTime = moment().format();

      await notification.save();

      await client_order.save();

      const members = await Rooms.find().sort('-lastTime');

      socketIO.to(room).emit('new-user', members);
    }
  }

  async UpdateSelectionState(status, room, socket) {
    const user = await Rooms.findOne({ room: room });

    const order = await OrderModel.findOne({
      _id: room?.split('-')[0],
    });

    user.product_status = status;

    order.status = status;

    await user.save();

    await order.save();

    const members = await Rooms.find().sort('-lastTime');

    socketIO.to(room).emit('new-user', members);
  }

  async Online(roomId, socket) {
    const user = await Rooms.findOne({ room: roomId });

    user.status = 'online';

    // user.newMessages = newMessages;

    await user.save();

    const members = await Rooms.find();

    socket.broadcast.emit('new-user', members);
  }

  async Offline(roomId, socket) {
    const user = await Rooms.findOne({ room: roomId });

    user.status = 'offline';

    // user.newMessages = newMessages;

    await user.save();

    const members = await Rooms.find();

    socket.broadcast.emit('new-user', members);
  }
}
