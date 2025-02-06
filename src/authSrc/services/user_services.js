import { GenerateOpt } from '../../../utils/otp_generator.js';
import UserModel from '../models/user.js';

export default class UserService {
  async getAUser(payload) {
    try {
      const user = await UserModel.findOne({ _id: payload?.userId });

      return user;
    } catch (err) {
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
}
