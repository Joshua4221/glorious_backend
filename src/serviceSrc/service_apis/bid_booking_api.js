import { StatusCodes } from "http-status-codes";
import ServiceModel from "../models/service_models.js";
import BidBookingServiceController from "../services/bid_booking_services.js";
import { adminAuthenticateUser } from "../../../utils/adminAuthentication.js";
import ServiceBookingModel from "../models/booked_services_model.js";
import BidBookingModel from "../models/bid_booking_model.js";
import { authenticateUser } from "../../../utils/authentication.js";

export const BidBookingsApiProvider = (app) => {
  const serviceController = new BidBookingServiceController();

  app.post(
    "/api/v1/bid_booking_services",
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.service_title) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Please provide Service Title",
          });
        }

        // Check if email or phone number already exists
        const alreadySaved = await ServiceModel.findOne({
          _id: req.body.servicesId,
        });

        if (!alreadySaved) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "Please provide Service does not exits",
          });
        }

        // Check if email or phone number already exists
        const book_service = await ServiceBookingModel.findOne({
          _id: req.body.BookingId,
        });

        if (!book_service) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message:
              "Please This Booked services is not part of our Booked services",
          });
        }

        // Create user and generate OTP
        const service = await serviceController.CreateBidService({
          ...req.body,
          bid_creator_name: user?.name,
          bid_creator_email: user?.email,
          bid_creator_Id: user?._id,
          bid_creator_phone: user?.phone_number,
        });

        res
          .status(StatusCodes.CREATED)
          .send({ message: "Success", data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    "/api/v1/get_all_bid_bookings_services/:page/:limit",
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const service = await serviceController.getOtherBookings(page, limit);

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: "Success", data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    "/api/v1/edit_bid_booking_service/:serviceId",
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { serviceId } = req.params;

        // Check if email or phone number already exists
        const alreadySaved = await BidBookingModel.findOne({
          _id: serviceId,
        }).lean();

        if (!alreadySaved) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "Bid service does not exist",
          });
        }

        // Create user and generate OTP
        const service = await serviceController.EditService(
          {
            ...alreadySaved,
            bidder: [
              ...alreadySaved?.bidder,
              {
                name: user?.name,
                email: user?.email,
                phone_number: user?.phone_number,
                userId: user?.userId,
                profile_pic: user?.profile_pic,
                cloudinary_id: user?.cloudinary_id,
                amount: req?.body?.amount,
              },
            ],
          },
          serviceId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: "Success", data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    "/api/v1/get_single_bid_booked_services/:serviceTitle",
    async (req, res, next) => {
      try {
        const { serviceTitle } = await req.params;

        const service = await serviceController.SingleBookingService({
          title: serviceTitle.split("@")[serviceTitle.split("@").length - 1],
        });

        if (!service) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "Service is not available",
          });
        }

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: "Success", data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
