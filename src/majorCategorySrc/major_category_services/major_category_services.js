import MajorCatgoryModel from '../major_category_models/major_category_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class MajorCategoryController {
  async CreateCategory(payload) {
    try {
      const category = await MajorCatgoryModel.create({ ...payload });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async SingleCategory(payload) {
    try {
      const category = await MajorCatgoryModel.findOne({
        _id: payload._id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async getCategory(page, limit) {
    try {
      const category = await MajorCatgoryModel.paginate(
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
      const category = await MajorCatgoryModel.find();

      return category;
    } catch (err) {
      throw err;
    }
  }

  async EditCategory(payload, id) {
    try {
      const category = await MajorCatgoryModel.findOneAndUpdate(
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
      const category = await MajorCatgoryModel.findByIdAndDelete({
        _id: Id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async SearchCategoryByName(name, page, limit) {
    try {
      const searchCategory = await MajorCatgoryModel.paginate(
        {
          name: { $regex: name, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return searchCategory;
    } catch (err) {
      throw err;
    }
  }
}
