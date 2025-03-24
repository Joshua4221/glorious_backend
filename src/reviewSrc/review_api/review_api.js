import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import ReviewController from '../review_services/review_services.js';
import ReviewModel from '../review_models/review_models.js';

export const ReviewApiProvider = (app) => {
  const reviewServices = new ReviewController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_review',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.name) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide name',
          });
        }

        const review = await reviewServices.createReview({
          ...req.body,
          adminEmail: user?.email,
          adminId: user?._id,
          adminName: user?.name,
        });

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: review });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get('/api/v1/get_all_review/:page/:limit', async (req, res, next) => {
    try {
      let { page, limit } = req.params;

      const review = await reviewServices.getReview(page, limit);

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: review });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_major_review', async (req, res, next) => {
    try {
      const review = await reviewServices.getAllMajorReview();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: review });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_review/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const review = await reviewServices.SingleReview({
          _id: Id,
        });

        if (!review) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'review is not available',
          });
        }

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: review });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_review/:reviewId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { reviewId } = req.params;

        const review = await ReviewModel.findOne({
          _id: reviewId,
        });

        if (!review) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'review does not exists',
          });
        }

        const review_state = await reviewServices.EditReview(
          { ...req.body, editedAdminEmail: user?.email },
          reviewId
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: review_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_review',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const reviewId = req.body.id;

        const review = await ReviewModel.findOne({
          _id: reviewId,
        });

        if (!review) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'review does not exists',
          });
        }

        const editedDetials = await reviewServices.deleteReview(reviewId);

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
    '/api/v1/search_for_review_by_name/:name/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { name, page, limit } = await req.params;

        const review = await reviewServices.SearchReviewByName(
          name,
          page,
          limit
        );

        res.status(StatusCodes.OK).json({ data: review, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
