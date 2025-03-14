import OrderModel from '../orderModel/order_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  collation: {
    locale: 'en',
  },
};

export default class OrderController {
  async CreateOrder(payload) {
    try {
      const order = await OrderModel.create({ ...payload });

      return order;
    } catch (err) {
      throw err;
    }
  }

  async SingleOrderByUser(payload) {
    try {
      const order = await OrderModel.findOne({
        createdBy: payload.user,
      }).lean();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async SingleOrderDetails(payload) {
    try {
      const order = await OrderModel.findOne({
        _id: payload.id,
      }).lean();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getOrder(status, page, limit) {
    try {
      const order = await OrderModel.paginate(
        status === 'all' ? {} : { status: status },
        { ...options, page: page, limit: limit }
      );

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getMyOrder(user, status, page, limit) {
    try {
      const order = await OrderModel.paginate(
        status === 'all'
          ? { createdBy: user }
          : { createdBy: user, status: status },
        { ...options, page: page, limit: limit }
      );

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserOrder(user, page, limit) {
    try {
      const order = await OrderModel.paginate(
        { createdBy: user },
        { ...options, page: page, limit: limit }
      );

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserPendingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        createdBy: user,
        status: 'pending',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserProcessingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        createdBy: user,
        status: 'processing',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserShippingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        createdBy: user,
        status: 'shipping',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserCompletedOrderCount(user) {
    try {
      const order = await OrderModel.find({
        createdBy: user,
        status: 'delivered',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserCancelOrderCount(user) {
    try {
      const order = await OrderModel.find({
        createdBy: user,
        status: 'cancelled',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllPendingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        status: 'pending',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllProcessingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        status: 'processing',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllShippingOrderCount(user) {
    try {
      const order = await OrderModel.find({
        status: 'shipping',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllCompletedOrderCount(user) {
    try {
      const order = await OrderModel.find({
        status: 'delivered',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllCancelOrderCount(user) {
    try {
      const order = await OrderModel.find({
        status: 'cancelled',
      }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllOrderCount() {
    try {
      const order = await OrderModel.find().countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllUserOrderCount(user) {
    try {
      const order = await OrderModel.find({ createdBy: user }).countDocuments();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getUserOrderDueToStatus(userId) {
    try {
      const order = await OrderModel.findOne({
        createdBy: userId,
        status: { $in: ['pending', 'processing', 'shipped'] },
      }).lean();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async EditOrder(payload, id) {
    try {
      const order = await OrderModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return order;
    } catch (err) {
      throw err;
    }
  }

  async deleteOrder(Id) {
    try {
      const order = await OrderModel.findByIdAndDelete({
        _id: Id,
      });

      return order;
    } catch (err) {
      throw err;
    }
  }
}
