import CatgoryModel from '../category_model/category_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  collation: {
    locale: 'en',
  },
};

export default class CategoryController {
  async CreateCategory(payload) {
    try {
      const category = await CatgoryModel.create({ ...payload });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async SingleCategory(payload) {
    try {
      const category = await CatgoryModel.findOne({
        _id: payload._id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async getCategory(page, limit) {
    try {
      const category = await CatgoryModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return category;
    } catch (err) {
      throw err;
    }
  }

  async getAllMajorCategory() {
    try {
      const category = await CatgoryModel.find();

      return category;
    } catch (err) {
      throw err;
    }
  }

  async EditCategory(payload, id) {
    try {
      const category = await CatgoryModel.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return category;
    } catch (err) {
      throw err;
    }
  }

  async deleteCategory(Id) {
    try {
      const category = await CatgoryModel.findByIdAndDelete({
        _id: Id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }
}
