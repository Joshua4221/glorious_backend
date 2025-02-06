import { GenerateOpt } from "../../../utils/otp_generator.js";
import UserModel from "../models/user.js";

export default class AuthController {
  async CreateUser(payload) {
    try {
      const otp = await GenerateOpt();

      const user = await UserModel.create({ ...payload, otp: otp });

      return user;
    } catch (err) {
      throw err;
    }
  }
}
