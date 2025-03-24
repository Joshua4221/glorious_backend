import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import MacueController from '../macue_services/macue_services.js';
import MacueModel from '../macue_model/macue_model.js';

export const MacueApiProvider = (app) => {
  const macueServices = new MacueController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_macue',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.title) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Macue title',
          });
        }

        const macue_title = await MacueModel.findOne({
          title: req.body.title,
        });

        if (macue_title) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'macue with title already exist',
          });
        }

        const macue = await macueServices.createMacue({
          ...req.body,
          adminEmail: user?.email,
          adminId: user?._id,
          adminName: user?.name,
        });

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: macue });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get('/api/v1/get_all_macue/:page/:limit', async (req, res, next) => {
    try {
      const { page, limit } = req.params;

      const macue = await macueServices.getMacue(page, limit);

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: macue });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_major_macue', async (req, res, next) => {
    try {
      const macue = await macueServices.getAllMajorMacue();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: macue });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_macue/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const macue = await macueServices.SingleMacue({
          _id: Id,
        });

        if (!macue) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'macue is not available',
          });
        }

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: macue });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_macue/:macueId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { macueId } = req.params;

        const macue = await MacueModel.findOne({
          _id: macueId,
        });

        if (!macue) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'macue does not exists',
          });
        }

        const macue_state = await macueServices.EditMacue(
          { ...req.body, editedAdminEmail: user?.email },
          macueId
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: macue_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_macue',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const macueId = req.body.id;

        const macue = await BrandModel.findOne({
          _id: macueId,
        });

        if (!macue) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'macue does not exists',
          });
        }

        const editedDetials = await macueServices.deleteMacue(brandId);

        res
          .status(StatusCodes.OK)
          .json({ data: editedDetials, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/search_for_macue_by_title/:title/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { title, page, limit } = await req.params;

        const macue = await macueServices.SearchMacueByName(title, page, limit);

        res.status(StatusCodes.OK).json({ data: macue, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
