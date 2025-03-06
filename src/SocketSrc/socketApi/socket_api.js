import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import Rooms from '../models/roomModel.js';
import NormalRooms from '../models/normalRoomModel.js';

export const SocketApiProvider = (app) => {
  app.get(
    '/api/v1/get_my_admin_rooms',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const rooms = await Rooms.find().sort('-lastTime');

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: rooms });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get('/api/v1/get_my_rooms', authenticateUser, async (req, res, next) => {
    try {
      const rooms = await Rooms.find({
        room: { $regex: req.user.userId, $options: 'i' },
      }).sort('-lastTime');

      // Return success response
      res.status(StatusCodes.CREATED).send({ message: 'success', data: rooms });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_my_normal_admin_rooms',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        console.log('joshua ejike');
        const rooms = await NormalRooms.find({
          room: { $regex: /^user/, $options: 'i' },
        }).sort('-lastTime');

        console.log(rooms, 'seaonal work');
        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: rooms });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_my_normal_admin_vendor_rooms',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        console.log('joshua ejike work');
        const rooms = await NormalRooms.find({
          room: { $regex: /^vendor/, $options: 'i' },
        }).sort('-lastTime');

        console.log(rooms, 'love hte lord');

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: rooms });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_my_normal_rooms',
    authenticateUser,
    async (req, res, next) => {
      try {
        const rooms = await NormalRooms.find({
          room: `${req.user.userId}-admin`,
        }).sort('-lastTime');

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: rooms });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
