import BrandModel from '../brand_model/brand_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class BrandController {
  async BrandCategory(payload) {
    try {
      const brand = await BrandModel.create({ ...payload });

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async SingleBrand(payload) {
    try {
      const brand = await BrandModel.findOne({
        _id: payload._id,
      });

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async getBrand(page, limit) {
    try {
      const brand = await BrandModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async getAllMajorBrand() {
    try {
      const brand = await BrandModel.find();

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async EditBrand(payload, id) {
    try {
      const brand = await BrandModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async deleteBrand(Id) {
    try {
      const brand = await BrandModel.findByIdAndDelete({
        _id: Id,
      });

      return brand;
    } catch (err) {
      throw err;
    }
  }

  async SearchBrandByName(name, page, limit) {
    try {
      const brand = await BrandModel.paginate(
        {
          name: { $regex: name, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return brand;
    } catch (err) {
      throw err;
    }
  }
}
