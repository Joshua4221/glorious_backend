import AdminModel from '../admin_models/admin_models.js';

export default class AdminController {
  async CreateUser(payload) {
    try {
      const user = await AdminModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }
}
