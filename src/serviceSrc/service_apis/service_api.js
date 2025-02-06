import { StatusCodes } from 'http-status-codes';
import ServiceModel from '../models/service_models.js';
import ServiceController from '../services/serviceProvider.js';
import { authenticateUser } from '../../../utils/authentication.js';
import ServiceCategoriesModel from '../models/service_categories_models.js';
import { socketIO } from '../../../index.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';

export const ServiceApiProvider = (app) => {
  const serviceController = new ServiceController();

  app.post(
    '/api/v1/services',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.service_title) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Service Title',
          });
        }

        // Check if email or phone number already exists
        const alreadySavedTitle = await ServiceModel.findOne({
          service_title: req.body.service_title,
        });

        if (alreadySavedTitle) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Service Title Already creaded',
          });
        }

        // Check if email or phone number already exists
        const alreadySaved = await ServiceCategoriesModel.findOne({
          category: req.body.category,
        });

        if (alreadySaved) {
          await ServiceCategoriesModel.create({
            category: req.body.category,
          });
        }

        // Create user and generate OTP
        const service = await serviceController.CreateService({
          ...req.body,
          name: user?.name,
          email: user?.email,
          createdBy: user?._id,
          phone_number: user?.phone_number,
        });

        const findAllService = await ServiceModel.find();

        socketIO.emit('services', findAllService);

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_my_services/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const service = await serviceController.getMyServices(
          page,
          limit,
          req.user.userId
        );

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_single_services/:serviceTitle',
    async (req, res, next) => {
      try {
        const { serviceTitle } = await req.params;

        const service = await serviceController.SingleService({
          title: serviceTitle.split('-').join(' '),
        });

        if (!service) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Service is not available',
          });
        }

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_service/:serviceId',
    adminAuthenticateUser,
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
            message: 'Service title already exists',
          });
        }

        const checkIfUser = await ServiceModel.findOne({
          _id: serviceId,
          createdBy: user?.userId,
        });

        if (!checkIfUser) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'User Can not edit this Service',
          });
        }

        // Create user and generate OTP
        const service = await serviceController.EditService(
          req.body,
          serviceId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/change_service_status/:serviceId',
    adminAuthenticateUser,
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
            message: 'Service title already exists',
          });
        }

        const checkIfUser = await ServiceModel.findOne({
          _id: serviceId,
          createdBy: user?.userId,
        });

        if (!checkIfUser) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'User Can not edit this Service',
          });
        }

        // Create user and generate OTP
        const service = await serviceController.EditService(
          { status: req?.body?.status },
          serviceId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/change_service_status/:serviceId',
    adminAuthenticateUser,
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
            message: 'Service title already exists',
          });
        }

        const checkIfUser = await ServiceModel.findOne({
          _id: serviceId,
          createdBy: user?.userId,
        });

        if (!checkIfUser) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'User Can not edit this Service',
          });
        }

        // Create user and generate OTP
        const service = await serviceController.EditService(
          { delete: req?.body?.delete },
          serviceId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'Success', data: service });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
