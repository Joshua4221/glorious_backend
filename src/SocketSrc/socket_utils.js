import Message from './models/messageModel.js';
import NormalMessage from './models/normalMessageModel.js';

export const getLastMessagesFromRoom = async (room) => {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);

  return roomMessages;
};

export const sortRoomMessagesByDate = async (messages) => {
  return await messages.sort(function (a, b) {
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
};

export const getLastMessagesFromNormalRoom = async (room) => {
  let roomMessages = await NormalMessage.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);

  return roomMessages;
};

export const sortNormalRoomMessagesByDate = async (messages) => {
  return await messages.sort(function (a, b) {
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
};
