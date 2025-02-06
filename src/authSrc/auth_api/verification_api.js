import { StatusCodes } from "http-status-codes";
import { authenticateUser } from "../../../utils/authentication.js";
import VerificationService from "../services/verificationServices.js";
import UserService from "../services/user_services.js";
import UserModel from "../models/user.js";

export const verificationApiProvider = (app) => {
  const verificationService = new VerificationService();

  app.post(
    "/api/v1/verify_through_whatsapp",
    authenticateUser,
    async (req, res, next) => {
      try {
        // Check if required fields are provided
        if (!req.body.phone_number) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Please provide phone number",
          });
        }

        const user = req.user;

        await verificationService.sendOtpThroughWhatspp(user, {
          phone: req.body.phone_number,
        });

        res
          .status(StatusCodes.OK)
          .json({ message: "success", data: { email: user?.email } });
      } catch (err) {
        // Handle errors and send an internal server error response
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.post(
    "/api/v1/verify_through_sms",
    authenticateUser,
    async (req, res, next) => {
      try {
        // Check if required fields are provided
        if (!req.body.phone_number) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Please provide phone number",
          });
        }

        const user = req.user;

        await verificationService.sendOtpThroughWhatspp(user, {
          phone: req.body.phone_number,
        });

        res
          .status(StatusCodes.OK)
          .json({ message: "success", data: { email: user?.email } });
      } catch (err) {
        // Handle errors and send an internal server error response
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  // Activate  Number OTP API endpoint
  app.post(
    "/api/v1/verify_account",
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if provided OTP is correct
        if (req?.body?.otp?.toLowerCase() !== user?.phone_otp?.toLowerCase()) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Please check your OTP; it is not correct",
          });
        }

        // Update the document in the database to set 'verify' to 'completed' and remove the 'otp' field
        await UserModel.updateOne(
          { email: user.email },
          { $set: { verify_phone: "completed" }, $unset: { phone_otp: 1 } }
        );

        // Create a response object without the 'otp' field
        const response = { ...user };
        delete response.otp;

        res.status(StatusCodes.OK).send({ message: "Success", data: response });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
