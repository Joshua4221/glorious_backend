import { GenerateOpt } from "../../../utils/otp_generator.js";

export default class OtpControllerServices {
  async CreateOtp() {
    try {
      const otp = await GenerateOpt();

      return otp;
    } catch (err) {
      throw err;
    }
  }
}
