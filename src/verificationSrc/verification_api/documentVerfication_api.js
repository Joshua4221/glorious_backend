import { StatusCodes } from "http-status-codes";
import { authenticateUser } from "../../../utils/authentication.js";
import UserModel from "../../authSrc/models/user.js";
import BusinessServicesController from "../services/businessServices.js";

export const documentVerificationApiProvider = (app) => {
  const businessServices = new BusinessServicesController();

  app.post(
    "/api/v1/document_verfication",
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const userDetails = await businessServices.fineDocumentVerification(
          user
        );

        if (userDetails.length > 0) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Document verification already done by this user",
          });
        }

        const business = await businessServices.CreateDocumentVerification({
          ...req.body,
          verify_document: "processing",
          name: user?.name,
          email: user?.email,
          verify_by: user?._id,
        });

        // Update the document in the database to set 'verify_business' to 'processing'
        await UserModel.updateOne(
          { email: user.email },
          { $set: { verify_document: "processing" } }
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
