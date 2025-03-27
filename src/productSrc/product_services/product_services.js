import ProductModel from '../models/product_models.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: { date: -1 },
  collation: {
    locale: 'en',
  },
};

export default class ProductController {
  async CreateProduct(payload) {
    try {
      const product = await ProductModel.create({ ...payload });

      return product;
    } catch (err) {
      throw err;
    }
  }

  async SearchProductByCategory(
    name,
    payload,
    brand,
    minPrice,
    maxPrice,
    page,
    limit
  ) {
    try {
      let query = {};

      // If category is provided, add it to the query
      if (payload !== '' && payload) {
        query.category = { $regex: payload, $options: 'i' };
      }

      // If category is provided, add it to the query
      if (brand !== '' && brand) {
        query.brand = { $regex: brand, $options: 'i' };
      }

      // If category is provided, add it to the query
      if (name) {
        query.product_name = { $regex: name, $options: 'i' };
      }

      // If minPrice or maxPrice is provided, add price range to the query
      if (
        (minPrice !== undefined || maxPrice !== undefined) &&
        minPrice > 0 &&
        maxPrice > 0
      ) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      const searchproduct = await ProductModel.paginate(query, {
        ...options,
        page: page,
        limit: limit,
      });

      return searchproduct;
    } catch (err) {
      throw err;
    }
  }

  async SearchProductByAmount(payload, page, limit) {
    try {
      const searchproduct = await ProductModel.paginate(
        {
          price: { $regex: payload, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return searchproduct;
    } catch (err) {
      throw err;
    }
  }

  async SingleProduct(payload) {
    try {
      const product = await ProductModel.findOne({
        _id: payload._id,
      });

      return product;
    } catch (err) {
      throw err;
    }
  }

  async getProduct(page, limit, sortBy) {
    try {
      let sortOptions = {};

      switch (sortBy) {
        case 'date':
          sortOptions = { date: -1 }; // Descending order by date
          break;
        case 'product_name_asc':
          sortOptions = { product_name: 1 }; // Ascending order by product_name
          break;
        case 'product_name_desc':
          sortOptions = { product_name: -1 }; // Descending order by product_name
          break;
        default:
          sortOptions = { date: -1 }; // Default sorting by date (desc)
      }

      const product = await ProductModel.paginate(
        {},
        { ...options, page: page, limit: limit, sort: sortOptions }
      );

      return product;
    } catch (err) {
      throw err;
    }
  }

  async getProductById(page, limit, id) {
    try {
      const product = await ProductModel.paginate(
        { createdBy: id },
        { ...options, page: page, limit: limit }
      );

      return product;
    } catch (err) {
      throw err;
    }
  }

  async getNewProduct(page, limit) {
    try {
      const product = await ProductModel.paginate(
        { tags: 'New Arrival' },
        { ...options, page: page, limit: limit }
      );

      return product;
    } catch (err) {
      throw err;
    }
  }

  async EditProduct(payload, id) {
    try {
      const product = await ProductModel.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return product;
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(Id) {
    try {
      const product = await ProductModel.findByIdAndDelete({
        _id: Id,
      });

      return product;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductCount() {
    try {
      const product = await ProductModel.find().countDocuments();

      return product;
    } catch (err) {
      throw err;
    }
  }

  async SearchProductByTitle(title, page, limit) {
    try {
      const searchproduct = await ProductModel.paginate(
        {
          product_name: { $regex: title, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return searchproduct;
    } catch (err) {
      throw err;
    }
  }
}
