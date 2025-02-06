import AdminModel from '../admin_models/admin_models.js';

export default class AdminUserService {
  async getUserData(payload) {
    try {
      const createUser = await AdminModel.findOne({
        _id: payload.userId,
      })
        .lean()
        .select('-password');

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async editUserData(userId, payload) {
    try {
      const createUser = await AdminModel.findOneAndUpdate(
        { _id: userId },
        { ...payload },
        { new: true, runValidators: true }
      ).select('-password');

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async SearchUserData(payload, limit) {
    try {
      const searchUser = await AdminModel.find({
        name: { $regex: payload, $options: 'i' },
      }).limit(Number(limit));

      return searchUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUserData(userId) {
    try {
      const createUser = await AdminModel.findByIdAndDelete({
        _id: userId,
      }).select('-password');

      return createUser;
    } catch (err) {
      throw err;
    }
  }
}
