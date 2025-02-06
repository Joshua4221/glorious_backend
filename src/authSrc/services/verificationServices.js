// import whatsappClient from "../../../WhatsappServices.js/whatsappMajor.js";
import {
  GenerateNumberOpt,
  GenerateOpt,
} from "../../../utils/otp_generator.js";

export default class VerificationService {
  async sendOtpThroughWhatspp(user, payload) {
    try {
      // const otp = await GenerateNumberOpt();

      const otp = "123456";

      user.phone_otp = otp;

      user.save();

      // console.log(whatsappClient, "Sees");

      // await whatsappClient.sendMessage(
      //   `${payload?.phone}@c.us`,
      //   `Hi ${
      //     user?.name
      //   } kindly use the OTP (${otp.toUpperCase()}) to complete your verification`
      // );

      return user;
    } catch (err) {
      throw err;
    }
  }
}
