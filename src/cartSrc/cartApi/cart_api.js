import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import CartController from '../cartServices/cart_services.js';
import ProductModel from '../../productSrc/models/product_models.js';
import CartModel from '../cartModel/cart_model.js';

export const CartApiProvider = (app) => {
  const cartService = new CartController();

  app.post('/api/v1/create_cart', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user;

      // Check if required fields are provided
      if (!req.body.productId) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Please provide Product Id',
        });
      }

      // Check if email or phone number already exists
      const productDetails = await ProductModel.findOne({
        _id: req.body.productId,
      }).lean();

      if (!productDetails) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Product with name Does not exist',
        });
      }

      const cart = await cartService.SingleCart({ id: req.body.productId });

      if (cart) {
        let cart_content = await CartModel.updateOne(
          { _id: cart._id },
          {
            $set: {
              quantity: cart?.quantity + 1,
              total_amount:
                Number(cart?.total_amount) + Number(productDetails?.price),
            },
          }
        );

        return res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: cart_content });
      }

      // Create user and generate OTP
      const cartDetails = await cartService.CreateCart({
        ...req.body,
        createdBy: productDetails.createdBy,
        name: productDetails.name,
        email: productDetails.email,
        phone_number: productDetails.phone_number,
        productId: req.body.productId,
        product_name: productDetails.product_name,
        product_name: productDetails.product_name,
        category: productDetails.category,
        sub_category: productDetails.sub_category,
        gallery: productDetails.gallery,
        thumbnail_image_id: productDetails.thumbnail_image_id,
        thumbnail_image_pic: productDetails.thumbnail_image_pic,
        total_amount: Number(productDetails.price),
        price_at_time_of_addition: Number(productDetails?.price),
        user_email: user?.email,
        username: user?.name,
        user_phone_number: user?.phone_number,
        user: user?.userId,
      });

      // Return success response
      res
        .status(StatusCodes.CREATED)
        .send({ message: 'success', data: cartDetails });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.get(
    '/api/v1/get_all_cart/:page/:limit',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const cart = await cartService.getCart(page, limit);

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: cart });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_single_cart/:Id',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const cart = await cartService.SingleCartDetails({
          id: Id,
        });

        if (!cart) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Cart is not available',
          });
        }

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: cart });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_cart/:cartId',
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { cartId } = req.params;

        // Check if email or phone number already exists
        const cart = await CartModel.findOne({
          _id: cartId,
        });

        if (!cart) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'cart does not exists',
          });
        }

        // Create user and generate OTP
        const cart_state = await cartService.EditCart({ ...req.body }, cartId);

        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: cart_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post('/api/v1/delete_cart', authenticateUser, async (req, res, next) => {
    try {
      const cartId = req.body.id;

      // Check if email or phone number already exists
      const cart = await CartModel.findOne({
        _id: cartId,
      });

      if (!cart) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'cart does not exists',
        });
      }

      const editedDetials = await cartService.deleteCart(productId);

      res
        .status(StatusCodes.OK)
        .json({ data: editedDetials, message: `success` });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });
};
