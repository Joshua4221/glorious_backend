import { StatusCodes } from 'http-status-codes';
import UserModel from '../models/user.js';
import OtpControllerServices from '../services/otp_controllerServices.js';
import { OtpMessageDisplay } from '../../../utils/otp_message.js';
import { sendEmail } from '../../../utils/otp_email_template.js';
import { Welcome_template } from '../../../utils/welcome_template.js';

export const OtpControllerApiProvider = (app) => {
  const otpController = new OtpControllerServices();

  // Activate OTP API endpoint
  app.post('/api/v1/activate_otp', async (req, res, next) => {
    try {
      // Find user by email and exclude password field from the result
      const user = await UserModel.findOne({ email: req.body.email }).lean();

      // Check if user exists
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'User does not exist',
        });
      }

      // Check if provided OTP is correct
      if (req?.body?.otp?.toLowerCase() !== user?.otp?.toLowerCase()) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Please check your OTP; it is not correct',
        });
      }

      // Update the document in the database to set 'verify' to 'completed' and remove the 'otp' field
      await UserModel.updateOne(
        { email: user.email },
        { $set: { verify_email: 'completed' }, $unset: { otp: 1 } }
      );

      // Generate OTP message and send it via email
      const WelcomeMessage = await Welcome_template({
        name: req.body.name,
      });

      await sendEmail(
        user.email,
        'Glad to Have You on Board, Welcome to AbaNAba!',
        WelcomeMessage
      );

      // Create a response object without the 'otp' field
      const response = { ...user };

      delete response.password;

      delete response.otp;

      res.status(StatusCodes.OK).send({ message: 'Success', data: response });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  // Activate OTP API endpoint
  app.post('/api/v1/request_otp', async (req, res, next) => {
    try {
      // Find user by email and exclude password field from the result
      const user = await UserModel.findOne({ email: req.body.email }).lean();

      // Check if user exists
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'User does not exist',
        });
      }

      const getOtp = await otpController.CreateOtp();

      // Update the document in the database to set 'verify' to 'completed' and remove the 'otp' field
      await UserModel.updateOne(
        { email: user.email },
        { $set: { otp: getOtp } }
      );

      // Generate OTP message and send it via email
      const OTPMessage = await OtpMessageDisplay({
        otpCode: getOtp,
      });

      const response = { ...user };

      delete response.password;

      delete response.otp;

      await sendEmail(user.email, 'Airdrop Punch OTP ', OTPMessage);

      res.status(StatusCodes.OK).send({ message: 'Success', data: response });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });
};
