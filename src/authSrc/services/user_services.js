import { GenerateOpt } from '../../../utils/otp_generator.js';
import UserModel from '../models/user.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class UserService {
  async getAUser(payload) {
    try {
      const user = await UserModel.findOne({ _id: payload?.userId }).lean();

      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllUser(page, limit) {
    try {
      const user = await UserModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return user;
    } catch (error) {
      throw err;
    }
  }

  async getAllUserCount() {
    try {
      const usersCount = await UserModel.find().countDocuments();

      return usersCount;
    } catch (error) {
      throw err;
    }
  }

  async sendOtpThroughWhatspp() {
    try {
      const otp = await GenerateOpt();

      const user = await UserModel.findOne({ _id: payload?.userId });

      return otp;
    } catch (err) {
      throw err;
    }
  }

  async editUserData(userId, payload) {
    try {
      const createUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { ...payload },
        { new: true, runValidators: true }
      ).select('-password');

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUserData(userId) {
    try {
      const createUser = await UserModel.findByIdAndDelete({
        _id: userId,
      }).select('-password');

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserCount() {
    try {
      const user = await UserModel.find().countDocuments();

      return user;
    } catch (err) {
      throw err;
    }
  }

  async SearchUserData(payload, page, limit) {
    try {
      const searchUser = await UserModel.paginate(
        {
          name: { $regex: payload, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return searchUser;
    } catch (err) {
      throw err;
    }
  }
}
