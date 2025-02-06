import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import ProductModel from '../models/product_models.js';
import ProductController from '../product_services/product_services.js';
import { authenticateUser } from '../../../utils/authentication.js';

export const UserProductApiProvider = (app) => {
  const productService = new ProductController();

  app.post(
    '/api/v1/user_create_product',
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.product_name) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Product name',
          });
        }

        // Check if email or phone number already exists
        const productDetails = await ProductModel.findOne({
          name: req.body.name,
        });

        if (productDetails) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Product with name already exist',
          });
        }

        // Create user and generate OTP
        const category = await productService.CreateProduct({
          ...req.body,
          email: user?.email,
          name: user?.name,
          phone_number: user?.phone_number,
          createdBy: user?.userId,
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
    '/api/v1/user_get_all_product/:page/:limit',
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const service = await productService.getProduct(page, limit);

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: service });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/user_get_single_product/:Id',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        console.log(
          Id,
          Id.split('@')[Id.split('@').length - 1],
          'season of work'
        );

        const product = await productService.SingleProduct({
          _id: Id.split('@')[Id.split('@').length - 1],
        });

        console.log(product, 'nothing');

        if (!product) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'product is not available',
          });
        }

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: product });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/user_edit_product/:productId',
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { productId } = req.params;

        // Check if email or phone number already exists
        const product = await ProductModel.findOne({
          _id: productId,
        });

        if (!product) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'product does not exists',
          });
        }

        // Create user and generate OTP
        const product_state = await productService.EditProduct(
          { ...req.body },
          productId
        );

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: product_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/user_delete_product',
    authenticateUser,
    async (req, res, next) => {
      try {
        const productId = req.body.id;

        // Check if email or phone number already exists
        const product = await ProductModel.findOne({
          _id: productId,
        });

        if (!product) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'product does not exists',
          });
        }

        const editedDetials = await productService.deleteProduct(productId);

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
    '/api/v1/search_for_product_by_category/:category/:page/:limit',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { category, page, limit } = await req.params;

        const product = await productService.SearchProductByCategory(
          category,
          page,
          limit
        );

        if (!product) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `product does not exit` });
        }

        res.status(StatusCodes.OK).json({ data: product, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/search_for_product_by_amount/:amount/:page/:limit',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { amount, page, limit } = await req.params;

        const product = await productService.SearchProductByCategory(
          amount,
          page,
          limit
        );

        if (!product) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `product does not exit` });
        }

        res.status(StatusCodes.OK).json({ data: product, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
