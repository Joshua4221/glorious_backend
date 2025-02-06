import { StatusCodes } from "http-status-codes";
import ServiceModel from "../models/service_models.js";
import { authenticateUser } from "../../../utils/authentication.js";
import BookingServiceController from "../services/booking_services_provider.js";

export const ServiceBookingsApiProvider = (app) => {
  const serviceController = new BookingServiceController();

  app.post(
    "/api/v1/booking_services",
    authenticateUser,
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

        // Create user and generate OTP
        const service = await serviceController.CreateService({
          ...req.body,
          booker_name: user?.name,
          booker_email: user?.email,
          BookedById: user?._id,
          // booker_phone_number: user?.phone_number,
        });

        // const findAllService = await ServiceModel.find();

        // socketIO.emit("services", findAllService);

        // Return success response
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
    "/api/v1/get_my_bookings_services/:page/:limit",
    authenticateUser,
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const service = await serviceController.getMyBookings(
          page,
          limit,
          req.user.userId
        );

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

  app.get(
    "/api/v1/get_other_bookings_services/:page/:limit",
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
    "/api/v1/edit_booking_service/:serviceId",
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { serviceId } = req.params;

        // Check if email or phone number already exists
        const alreadySaved = await ServiceModel.findOne({
          _id: serviceId,
        });

        if (!alreadySaved) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "Service title already exists",
          });
        }

        const checkIfUser = await ServiceModel.findOne({
          _id: serviceId,
          createdBy: user?.userId,
        });

        if (!checkIfUser) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: "User Can not edit this Service",
          });
        }

        // Create user and generate OTP
        const service = await serviceController.EditService(
          req.body,
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
    "/api/v1/get_single_booked_services/:serviceTitle",
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
