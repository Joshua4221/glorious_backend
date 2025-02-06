import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import CatgoryModel from '../category_model/category_model.js';
import SubCategoryController from '../category_services/sub_categroy_services.js';
import SubCatgoryModel from '../category_model/sub_category_model.js';
import CategoryController from '../category_services/category_services.js';

export const SubCategoryApiProvider = (app) => {
  const categoryServices = new CategoryController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_sub_categroy',
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

        // Check if email or phone number already exists
        const categoryName = await CatgoryModel.findOne({
          _id: req.body.category_id,
        }).lean();

        if (!categoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Category with name already exist',
          });
        }

        // Check if email or phone number already exists
        const subcategoryName = await categoryName?.sub_category?.find(
          (item) => item?.name === req.body.name
        );

        if (subcategoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Sub Category with name already exist',
          });
        }

        // Create user and generate OTP
        const category = await categoryServices.EditCategory(
          {
            ...categoryName,
            sub_category: [
              ...categoryName.sub_category,
              {
                ...req.body,
                adminEmail: user?.email,
                adminId: user?._id,
                adminName: user?.phone_number,
              },
            ],
          },
          req.body.category_id
        );

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

  app.get('/api/v1/get_all_sub_category/:Id', async (req, res, next) => {
    try {
      // Check if email or phone number already exists
      const categoryName = await CatgoryModel.findOne({
        _id: req.params.Id,
      }).lean();

      if (!categoryName) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Category with name already exist',
        });
      }

      // Return success response
      res.status(StatusCodes.CREATED).send({
        message: 'success',
        data: categoryName,
      });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_sub_category/:Id/:name',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id, name } = await req.params;

        const category = await categoryServices.SingleCategory({
          _id: Id,
        });

        if (!category) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'category is not available',
          });
        }

        // Check if email or phone number already exists
        const subcategoryName = await category?.sub_category?.find(
          (item) => item?.name === name
        );

        if (!subcategoryName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Sub Category with name Does not exist',
          });
        }

        // Return success response
        res.status(StatusCodes.CREATED).send({
          message: 'success',
          data: { category: category, sub_category: subcategoryName },
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_sub_category/:categoryId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { categoryId } = req.params;

        // Check if email or phone number already exists
        const category = await CatgoryModel.findOne({
          _id: categoryId,
        }).lean();

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
    '/api/v1/delete_sub_category',
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

        // Create user and generate OTP
        const categroy_state = await categoryServices.EditCategory(
          { ...req.body },
          categoryId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: categroy_state });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
