import AdminModel from '../admin_models/admin_models.js';

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
