import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import ReelModel from '../reel_model/reel_model.js';
import ReelController from '../reel_services/reel_services.js';

export const ReelApiProvider = (app) => {
  const reelServices = new ReelController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_reel',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.title) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide reel title',
          });
        }

        const reelTitle = await ReelModel.findOne({
          title: req.body.title,
        });

        if (reelTitle) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Reel with title already exist',
          });
        }

        const reels = await reelServices.CreateReel({
          ...req.body,
          adminEmail: user?.email,
          adminId: user?._id,
          adminName: user?.name,
        });

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: reels });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get('/api/v1/get_all_reels/:page/:limit', async (req, res, next) => {
    try {
      const { page, limit } = req.params;

      console.log(page, limit, 'versions');

      const reels = await reelServices.getReel(page, limit);

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: reels });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_major_reels', async (req, res, next) => {
    try {
      const reels = await reelServices.getAllMajorReel();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: reels });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_reels/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const reels = await reelServices.SingleReel({
          _id: Id,
        });

        if (!reels) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'brand is not available',
          });
        }

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: reels });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_reels/:reelsId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { reelsId } = req.params;

        const reels = await ReelModel.findOne({
          _id: reelsId,
        });

        if (!reels) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'reels does not exists',
          });
        }

        const reels_state = await reelServices.EditReel(
          { ...req.body, editedAdminEmail: user?.email },
          reelsId
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: reels_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_reels',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const reelsId = req.body.id;

        const reels = await ReelModel.findOne({
          _id: reelsId,
        });

        if (!reels) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'reels does not exists',
          });
        }

        const editedDetials = await reelServices.deleteReel(reelsId);

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
    '/api/v1/search_for_reels_by_title/:title/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { title, page, limit } = await req.params;

        const reels = await reelServices.SearchReelByTitle(title, page, limit);

        res.status(StatusCodes.OK).json({ data: reels, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
