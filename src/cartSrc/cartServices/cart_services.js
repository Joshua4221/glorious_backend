import CartModel from '../cartModel/cart_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  collation: {
    locale: 'en',
  },
};

export default class CartController {
  async CreateCart(payload) {
    try {
      const cart = await CartModel.create({ ...payload });

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async SingleCart(payload) {
    try {
      const cart = await CartModel.findOne({
        productId: payload.id,
      }).lean();

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async SingleCartByUser(payload) {
    try {
      const cart = await CartModel.findOne({
        createdBy: payload.user,
      }).lean();

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async SingleCartDetails(payload) {
    try {
      const cart = await CartModel.findOne({
        _id: payload.id,
      }).lean();

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getCart(userId) {
    try {
      const cart = await CartModel.findOne({ createdBy: userId }).lean();

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async EditCart(payload, id) {
    try {
      const cart = await CartModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async deleteCart(Id) {
    try {
      const cart = await CartModel.findByIdAndDelete({
        _id: Id,
      });

      return cart;
    } catch (err) {
      throw err;
    }
  }
}
