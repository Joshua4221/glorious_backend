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
