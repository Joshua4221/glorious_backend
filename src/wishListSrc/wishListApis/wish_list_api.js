import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import ProductModel from '../../productSrc/models/product_models.js';
import WishListController from '../wishListServices/wish_list_services.js';
import WishListModel from '../wishListModels/wish_list_model.js';

export const WishListApiProvider = (app) => {
  const wishlistService = new WishListController();

  app.post(
    '/api/v1/create_wish_list',
    authenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { productId, quantity, color } = req.body;

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

        const wish_list = await wishlistService.SingleWishListByUser({
          user: user?.userId,
        });

        if (!wish_list) {
          const wishlistDetails = await wishlistService.CreateWishList({
            totalPrice:
              Number(productDetails.price) > Number(productDetails.discount)
                ? Number(productDetails.discount)
                : Number(productDetails.price),
            email: user?.email,
            name: user?.name,
            phone_number: user?.phone_number,
            createdBy: user?.userId,
            symbol: productDetails?.symbol,
            products: [
              {
                product: productId,
                product_name: productDetails?.product_name,
                price:
                  Number(productDetails.price) > Number(productDetails.discount)
                    ? Number(productDetails.discount)
                    : Number(productDetails.price),
                gallery: productDetails?.gallery,
                color: color,
                symbol: productDetails?.symbol,
              },
            ],
          });

          return res
            .status(StatusCodes.CREATED)
            .send({ message: 'success', data: wishlistDetails, cartIndex: 0 });
        }

        // Check if product already in cart
        let itemIndex = wish_list.products.findIndex(
          (item) => item.product.toString() === productId
        );

        if (itemIndex <= -1) {
          // Add new item
          wish_list.products.push({
            product: productId,
            product_name: productDetails?.product_name,
            price:
              Number(productDetails.price) > Number(productDetails.discount)
                ? Number(productDetails.discount)
                : Number(productDetails.price),

            gallery: productDetails?.gallery,
            color: color,
            symbol: productDetails?.symbol,
          });

          itemIndex = wish_list?.products?.length - 1;
        } else {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Product have been added to wish list.',
          });
        }

        // Recalculate total price
        wish_list.totalPrice = wish_list.products.reduce(
          (acc, item) =>
            acc +
            (Number(item.price) > Number(item.discount)
              ? Number(item.discount)
              : Number(item.price)),
          0
        );

        const wish_list_state = await wishlistService.EditWishList(
          wish_list,
          wish_list?._id
        );

        // Return success response
        res.status(StatusCodes.OK).send({
          message: 'success',
          data: wish_list_state,
          cartIndex: itemIndex,
        });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/get_all_wish_list',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { userId } = req.user;

        const wishlist = await wishlistService.getWishList(userId);

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: wishlist });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_single_wish_list/:Id',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const productId = Id.split('@')[Id.split('@').length - 1];

        const { userId } = req.user;

        const wishlist = await wishlistService.getWishList(userId);

        if (!wishlist) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Wish List is not available',
          });
        }

        const details = wishlist?.products?.find(
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

  app.patch(
    '/api/v1/edit_wish_list/:wishlistId',
    authenticateUser,
    async (req, res) => {
      try {
        const { wishlistId } = req.params;
        const { userId } = req.user;

        // Fetch the user's cart
        const wishlist = await wishlistService.getWishList(userId);

        if (!wishlist) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: 'Wish List does not exist',
          });
        }

        // Filter out the product to be removed
        const updatedProducts = wishlist.products.filter(
          (item) => item.product.toString() !== wishlistId
        );

        // Recalculate total price & discount
        const totalPrice = updatedProducts.reduce(
          (acc, item) => acc + Number(item.price),
          0
        );

        // Update the cart
        const updatedWishlist = await wishlistService.EditWishList(
          {
            ...wishlist,
            products: updatedProducts,
            totalPrice,
          },
          wishlist._id
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: updatedWishlist });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_wish_list',
    authenticateUser,
    async (req, res, next) => {
      try {
        const wishlistId = req.body.id;

        // Check if email or phone number already exists
        const wishlist = await WishListModel.findOne({
          _id: wishlistId,
        });

        if (!wishlist) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Wish List does not exists',
          });
        }

        const editedDetials = await wishlistService.deleteWishList(wishlistId);

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
};
