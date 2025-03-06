import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import OrderController from '../orderServices/order_services.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import Rooms from '../../SocketSrc/models/roomModel.js';

export const OrderApiProvider = (app) => {
  const orderService = new OrderController();

  app.get(
    '/api/v1/get_all_order/:status/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { status, page, limit } = req.params;

        const cart = await orderService.getOrder(status, page, limit);

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: cart });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_my_order/:status/:page/:limit',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { userId } = req.user;

        const { status, page, limit } = req.params;

        console.log(status, page, limit, 'season of work');

        const cart = await orderService.getMyOrder(userId, status, page, limit);

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: cart });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_single_order/:Id',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const orderId = Id.split('@')[Id.split('@').length - 1];

        const order = await orderService.SingleOrderDetails({ id: orderId });

        if (!order) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Order is not available',
          });
        }

        res.status(StatusCodes.OK).send({ message: 'success', data: order });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_single_admin_order/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const orderId = Id.split('@')[Id.split('@').length - 1];

        const order = await orderService.SingleOrderDetails({ id: orderId });

        if (!order) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'Order is not available',
          });
        }

        res.status(StatusCodes.OK).send({ message: 'success', data: order });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_order/:orderId',
    authenticateUser,
    async (req, res) => {
      try {
        const { orderId } = req.params;

        const { status } = req.body;

        console.log(orderId, status, 'vision');

        // Fetch the user's order
        const order = await orderService.SingleOrderDetails({ id: orderId });

        if (!order) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: 'Order does not exist',
          });
        }

        // Update the order
        const updatedOrder = await orderService.EditOrder(
          {
            ...order,
            status: status,
          },
          orderId
        );

        await Rooms.findOneAndUpdate(
          { room: `${orderId}-${order?.createdBy}-admin` },
          { product_status: status },
          {
            new: true,
            runValidators: true,
          }
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: updatedOrder });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_admin_order/:orderId',
    adminAuthenticateUser,
    async (req, res) => {
      try {
        const { orderId } = req.params;

        const { status } = req.body;

        const { userId } = req.user;

        // Fetch the user's order
        const order = await orderService.SingleOrderDetails({ id: orderId });

        if (!order) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: 'Order does not exist',
          });
        }

        // Update the order
        const updatedOrder = await orderService.EditOrder(
          {
            ...order,
            status: status,
          },
          orderId
        );

        await Rooms.findOneAndUpdate(
          { room: `${orderId}-${order?.createdBy}-admin` },
          { product_status: status },
          {
            new: true,
            runValidators: true,
          }
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: updatedOrder });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
