import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import CategoryController from '../category_services/category_services.js';
import CatgoryModel from '../category_model/category_model.js';
import SubCatgoryModel from '../category_model/sub_category_model.js';

export const CategoryApiProvider = (app) => {
  const categoryServices = new CategoryController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_categroy',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        console.log('joshua');

        // Check if required fields are provided
        if (!req.body.name) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Category name',
          });
        }

        // Check if email or phone number already exists
        const categoryName = await CatgoryModel.findOne({
          name: req.body.name,
        });

        console.log(categoryName, 'finish the work');

        if (categoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Category with name already exist',
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

  app.get('/api/v1/get_all_category/:page/:limit', async (req, res, next) => {
    try {
      const { page, limit } = req.params;

      const service = await categoryServices.getCategory(page, limit);

      // Return success response
      res
        .status(StatusCodes.CREATED)
        .send({ message: 'success', data: service });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_major_category', async (req, res, next) => {
    try {
      const service = await categoryServices.getAllMajorCategory();

      // Return success response
      res
        .status(StatusCodes.CREATED)
        .send({ message: 'success', data: service });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_category/:Id',
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

  app.patch(
    '/api/v1/edit_category/:categoryId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { categoryId } = req.params;

        // Check if email or phone number already exists
        const category = await CatgoryModel.findOne({
          _id: categoryId,
        });

        if (!category) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'category does not exists',
          });
        }

        // Create user and generate OTP
        const categroy_state = await categoryServices.EditCategory(
          { ...req.body, editedAdminEmail: user?.email },
          categoryId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: categroy_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_category',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const categoryId = req.body.id;

        // Check if email or phone number already exists
        const category = await CatgoryModel.findOne({
          _id: categoryId,
        });

        if (!category) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'category does not exists',
          });
        }

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
    '/api/v1/search_for_category_by_name/:name/:page/:limit',
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
