import { StatusCodes } from 'http-status-codes';
import ProductModel from '../models/product_models.js';
import ProductController from '../product_services/product_services.js';
import { authenticateUser } from '../../../utils/authentication.js';

export const UserProductApiProvider = (app) => {
  const productService = new ProductController();

  app.get(
    '/api/v1/user_get_all_product/:page/:limit',
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const service = await productService.getProduct(page, limit);

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: service });
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

        const product = await productService.SingleProduct({
          _id: Id.split('@')[Id.split('@').length - 1],
        });

        if (!product) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'product is not available',
          });
        }

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: product });
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
          .status(StatusCodes.OK)
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
    '/api/v1/search_for_product_by_category/:name/:category/:brand/:from/:to/:page/:limit',
    async (req, res, next) => {
      try {
        let { name, category, brand, from, to, page, limit } = await req.params;

        // Normalize empty string parameters
        if (name === '""' || name === "''" || !name) name = '';
        if (category === '""' || category === "''" || !category) category = '';
        if (brand === '""' || brand === "''" || !brand) brand = '';

        const product = await productService.SearchProductByCategory(
          name,
          category,
          brand,
          Number(from),
          Number(to),
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

  app.get('/api/v1/get_new_product/:page/:limit', async (req, res, next) => {
    try {
      const { page, limit } = await req.params;

      const product = await productService.getNewProduct(page, limit);

      res.status(StatusCodes.OK).json({ data: product, message: `success` });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.get(
    '/api/v1/user_search_for_product_by_title/:title/:page/:limit',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { title, page, limit } = await req.params;

        const product = await productService.SearchProductByTitle(
          title,
          page,
          limit
        );

        res.status(StatusCodes.OK).json({ data: product, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
