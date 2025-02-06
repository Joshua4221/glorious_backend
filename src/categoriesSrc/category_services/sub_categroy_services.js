import SubCatgoryModel from '../category_model/sub_category_model.js';

export default class SubCategoryController {
  async CreateCategory(payload) {
    try {
      const category = await SubCatgoryModel.create({ ...payload });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async SingleCategory(payload) {
    try {
      const category = await SubCatgoryModel.findOne({
        _id: payload._id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }

  async getCategory() {
    try {
      const category = await SubCatgoryModel.find();

      return category;
    } catch (err) {
      throw err;
    }
  }

  async EditCategory(payload, id) {
    try {
      const category = await SubCatgoryModel.findOneAndUpdate(
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
      const category = await SubCatgoryModel.findByIdAndDelete({
        _id: Id,
      });

      return category;
    } catch (err) {
      throw err;
    }
  }
}
