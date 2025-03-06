import mongoose from 'mongoose';

const NormalRoomsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"],
  },

  email: {
    type: String,
    required: [true, "Can't be blank"],
  },

  roomOwner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },

  room: {
    type: String,
    unique: true,
    required: [true, 'Please provide room'],
  },

  picture: {
    type: String,
  },

  date: { type: Date, default: Date.now },

  lastTime: { type: Date, default: Date.now },

  status: {
    type: String,
    default: 'online',
  },

  lastMessage: {
    type: String,
  },

  notification: { type: Number, default: 0 },

  client_notification: { type: Number, default: 0 },
});

const NormalRooms = mongoose.model('Normal_Rooms', NormalRoomsSchema);

export default NormalRooms;
