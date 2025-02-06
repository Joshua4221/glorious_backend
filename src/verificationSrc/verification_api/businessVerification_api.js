import { StatusCodes } from "http-status-codes";
import { authenticateUser } from "../../../utils/authentication.js";
import UserModel from "../../authSrc/models/user.js";
import BusinessServicesController from "../services/businessServices.js";

export const businessVerificationApiProvider = (app) => {
  const businessServices = new BusinessServicesController();

  app.post(
    "/api/v1/bussiness_verfication",
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const userDetails = await businessServices.fineVerification(user);

        if (userDetails.length > 0) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Business verification already done by this user",
          });
        }

        const business = await businessServices.CreateBusinessVerification({
          ...req.body,
          verify_business: "processing",
          name: user?.name,
          email: user?.email,
          verify_by: user?._id,
        });

        // Update the document in the database to set 'verify_business' to 'processing'
        await UserModel.updateOne(
          { email: user.email },
          { $set: { verify_business: "processing" } }
        );

        res.status(StatusCodes.OK).json({ data: business, message: "success" });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
