import WishListModel from '../wishListModels/wish_list_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  collation: {
    locale: 'en',
  },
};

export default class WishListController {
  async CreateWishList(payload) {
    try {
      const wish_list = await WishListModel.create({ ...payload });

      return wish_list;
    } catch (err) {
      throw err;
    }
  }

  async SingleWishList(payload) {
    try {
      const wishlist = await WishListModel.findOne({
        productId: payload.id,
      }).lean();

      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async SingleWishListByUser(payload) {
    try {
      const wishlist = await WishListModel.findOne({
        createdBy: payload.user,
      }).lean();

      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async SingleWishListDetails(payload) {
    try {
      const wishlist = await WishListModel.findOne({
        _id: payload.id,
      }).lean();

      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async getWishList(userId) {
    try {
      const wishlist = await WishListModel.findOne({
        createdBy: userId,
      }).lean();

      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async EditWishList(payload, id) {
    try {
      const wishlist = await WishListModel.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async deleteWishList(Id) {
    try {
      const wishlist = await WishListModel.findByIdAndDelete({
        _id: Id,
      });

      return wishlist;
    } catch (err) {
      throw err;
    }
  }
}
