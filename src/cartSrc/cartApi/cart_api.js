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

      const { productId, quantity } = req.body;

      // Check if required fields are provided
      if (!productId) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Please provide Product Id',
        });
      }

      // Check if email or phone number already exists
      const productDetails = await ProductModel.findOne({
        _id: productId,
      }).lean();

      if (!productDetails) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Product not found',
        });
      }

      const cart = await cartService.SingleCartByUser({ user: user?.userId });

      if (!cart) {
        const cartDetails = await cartService.CreateCart({
          totalPrice: Number(productDetails.price),
          totalDiscount: Number(productDetails.discount),
          email: user?.email,
          name: user?.name,
          phone_number: user?.phone_number,
          createdBy: user?.userId,
          symbol: productDetails?.symbol,
          products: [
            {
              product: productId,
              product_name: productDetails?.product_name,
              quantity: 1,
              price: Number(productDetails.price),
              discount: Number(productDetails.discount),
              gallery: productDetails?.gallery,
              totalPrice: Number(productDetails.price),
              totalDiscount: Number(productDetails.discount),
              symbol: productDetails?.symbol,
            },
          ],
        });

        return res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: cartDetails, cartIndex: 0 });
      }

      // Check if product already in cart
      let itemIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.products[itemIndex].quantity += quantity;

        cart.products[itemIndex].totalPrice =
          cart.products[itemIndex].quantity *
          Number(cart.products[itemIndex].price);

        cart.products[itemIndex].totalDiscount =
          cart.products[itemIndex].quantity *
          Number(cart.products[itemIndex].discount);
      } else {
        // Add new item
        cart.products.push({
          product: productId,
          product_name: productDetails?.product_name,
          quantity: quantity,
          price: Number(productDetails.price),
          discount: Number(productDetails.discount),
          totalPrice: quantity * Number(productDetails.price),
          totalDiscount: quantity * Number(productDetails.discount),
          gallery: productDetails?.gallery,
          symbol: productDetails?.symbol,
        });

        itemIndex = cart?.products?.length - 1;
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.quantity * Number(item.price),
        0
      );

      // Recalculate total discount
      cart.totalDiscount = cart.products.reduce(
        (acc, item) => acc + item.quantity * Number(item.discount),
        0
      );

      const cart_state = await cartService.EditCart(cart, cart?._id);

      // Return success response
      res
        .status(StatusCodes.OK)
        .send({ message: 'success', data: cart_state, cartIndex: itemIndex });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.get('/api/v1/get_all_cart', authenticateUser, async (req, res, next) => {
    try {
      const { userId } = req.user;

      const cart = await cartService.getCart(userId);

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: cart });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_cart/:Id',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const productId = Id.split('@')[Id.split('@').length - 1];

        const { userId } = req.user;

        const cart = await cartService.getCart(userId);

        if (!cart) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Cart is not available',
          });
        }

        const details = cart?.products?.find(
          (item) => item?.product.toString() === productId
        );

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: details });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch('/api/v1/edit_cart/:cartId', authenticateUser, async (req, res) => {
    try {
      const { cartId } = req.params;
      const { userId } = req.user;

      // Fetch the user's cart
      const cart = await cartService.getCart(userId);
      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'Cart does not exist',
        });
      }

      // Filter out the product to be removed
      const updatedProducts = cart.products.filter(
        (item) => item.product.toString() !== cartId
      );

      // Recalculate total price & discount
      const totalPrice = updatedProducts.reduce(
        (acc, item) => acc + item.quantity * Number(item.price),
        0
      );

      const totalDiscount = updatedProducts.reduce(
        (acc, item) => acc + item.quantity * Number(item.discount),
        0
      );

      // Update the cart
      const updatedCart = await cartService.EditCart(
        {
          ...cart,
          products: updatedProducts,
          totalPrice,
          totalDiscount,
        },
        cart._id
      );

      res
        .status(StatusCodes.OK)
        .send({ message: 'success', data: updatedCart });
    } catch (error) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

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

      const editedDetials = await cartService.deleteCart(cartId);

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
