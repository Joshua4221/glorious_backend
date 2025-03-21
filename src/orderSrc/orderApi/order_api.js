import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import OrderController from '../orderServices/order_services.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import Rooms from '../../SocketSrc/models/roomModel.js';
import { sendOrderEmail } from '../../../utils/sendingEmailOrder.js';

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

        await sendOrderEmail({ ...order, status: status });

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
    '/api/v1/edit_address_order/:orderId',
    authenticateUser,
    async (req, res) => {
      try {
        const { orderId } = req.params;

        console.log(orderId, 'josu');

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
            ...req.body,
          },
          orderId
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

        // Prevent updating to "shipping" or "delivered" if payment_status is not "paid"
        if (
          ['shipping', 'delivered'].includes(status) &&
          order.payment_status !== 'paid'
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message:
              'Cannot update order status to shipping or delivered unless payment is completed.',
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

        await sendOrderEmail({ ...order, status: status });

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
    '/api/v1/edit_admin_payment_order/:orderId',
    adminAuthenticateUser,
    async (req, res) => {
      try {
        const { orderId } = req.params;

        const { payment } = req.body;

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
            payment_status: payment,
          },
          orderId
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

  app.get(
    '/api/v1/get_a_user_order/:Id/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id, page, limit } = await req.params;

        const order = await orderService.getAllUserOrder(Id, page, limit);

        res.status(StatusCodes.OK).send({ message: 'success', data: order });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_a_user_status_count_order/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const pending_order = await orderService.getAllUserPendingOrderCount(
          Id
        );

        const complete_order = await orderService.getAllUserCompletedOrderCount(
          Id
        );

        const cancel_order = await orderService.getAllUserCancelOrderCount(Id);

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: {
            pending: pending_order,
            completed: complete_order,
            cancelled: cancel_order,
          },
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_a_user_advanced_total_status_count_order',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { userId } = await req.user;

        const order_count = await orderService.getAllUserOrderCount(userId);

        const pending_order = await orderService.getAllUserPendingOrderCount(
          userId
        );

        const complete_order = await orderService.getAllUserCompletedOrderCount(
          userId
        );

        const cancel_order = await orderService.getAllUserCancelOrderCount(
          userId
        );

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: {
            total: order_count,
            pending: pending_order,
            completed: complete_order,
            cancelled: cancel_order,
          },
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_a_user_advanced_status_count_order',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { userId } = await req.user;

        const pending_order = await orderService.getAllUserPendingOrderCount(
          userId
        );

        const processing_order =
          await orderService.getAllUserProcessingOrderCount(userId);

        const shipping_order = await orderService.getAllUserShippingOrderCount(
          userId
        );

        const complete_order = await orderService.getAllUserCompletedOrderCount(
          userId
        );

        const cancel_order = await orderService.getAllUserCancelOrderCount(
          userId
        );

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: {
            pending: pending_order,
            processing: processing_order,
            shipping: shipping_order,
            completed: complete_order,
            cancelled: cancel_order,
          },
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_status_count_order',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const pending_order = await orderService.getAllPendingOrderCount();

        const processing_order =
          await orderService.getAllProcessingOrderCount();

        const shipping_order = await orderService.getAllShippingOrderCount();

        const complete_order = await orderService.getAllCompletedOrderCount();

        const cancel_order = await orderService.getAllCancelOrderCount();

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: {
            pending: pending_order,
            processing: processing_order,
            shipping: shipping_order,
            completed: complete_order,
            cancelled: cancel_order,
          },
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_all_count_order',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const order_count = await orderService.getAllOrderCount();

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: order_count,
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/get_all_user_count_order',
    authenticateUser,
    async (req, res, next) => {
      try {
        const { userId } = req.user;

        const order_count = await orderService.getAllUserOrderCount(userId);

        res.status(StatusCodes.OK).send({
          message: 'success',
          data: order_count,
        });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/search_for_order_by_name/:name/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { name, page, limit } = await req.params;

        const order = await orderService.SearchOrderByName(name, page, limit);

        res.status(StatusCodes.OK).json({ data: order, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
