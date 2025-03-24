import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import MajorCategoryController from '../major_category_services/major_category_services.js';
import CatgoryModel from '../../categoriesSrc/category_model/category_model.js';
import MajorCatgoryModel from '../major_category_models/major_category_model.js';

export const MajorCategoryApiProvider = (app) => {
  const categoryServices = new MajorCategoryController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_major_categroy',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.name) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Category name',
          });
        }

        const categoryName = await CatgoryModel.findOne({
          name: req.body.name,
        });

        if (!categoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Category with name Does not exist',
          });
        }

        const majorCategoryName = await MajorCatgoryModel.findOne({
          name: req.body.name,
        });

        if (majorCategoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'This Major Category with name Already exist',
          });
        }

        // Create user and generate OTP
        const category = await categoryServices.CreateCategory({
          ...req.body,
          adminEmail: user?.email,
          adminId: user?._id,
          adminName: user?.name,
        });

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: category });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/get_all_major_category/:page/:limit',
    async (req, res, next) => {
      try {
        const { page, limit } = req.params;

        const service = await categoryServices.getCategory(page, limit);

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get('/api/v1/get_all_major_major_category', async (req, res, next) => {
    try {
      const service = await categoryServices.getAllMajorCategory();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: service });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_major_category/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const category = await categoryServices.SingleCategory({
          _id: Id,
        });

        if (!category) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'category is not available',
          });
        }

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: category });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_major_category',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const categoryId = req.body.id;

        const editedDetials = await categoryServices.deleteCategory(categoryId);

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
    '/api/v1/search_for_major_category_by_name/:name/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { name, page, limit } = await req.params;

        const category = await categoryServices.SearchCategoryByName(
          name,
          page,
          limit
        );

        res.status(StatusCodes.OK).json({ data: category, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
