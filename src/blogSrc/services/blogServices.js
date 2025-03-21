import { ArticlesModel } from '../models/blog.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class BlogService {
  async createBlog(payload) {
    try {
      const createUser = await ArticlesModel.create({ ...payload });

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async editBlog(userId, payload) {
    try {
      const createUser = await ArticlesModel.findOneAndUpdate(
        { _id: userId },
        { ...payload },
        { new: true, runValidators: true }
      );

      return createUser;
    } catch (err) {
      throw err;
    }
  }

  async getBlogs(page, limit) {
    try {
      const getBlogs = await ArticlesModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return getBlogs;
    } catch (err) {
      throw err;
    }
  }

  async blogCount() {
    try {
      const getBlogCount = await ArticlesModel.find({
        publish: true,
      }).countDocuments();

      return getBlogCount;
    } catch (err) {
      throw err;
    }
  }

  async getMyBlogs(page, limit, userId) {
    try {
      const getBlogs = await ArticlesModel.paginate(
        {
          createdBy: userId,
          publish: true,
        },
        { ...options, page: page, limit: limit }
      );

      return getBlogs;
    } catch (err) {
      throw err;
    }
  }

  async myBlogCount(userId) {
    try {
      const getBlogCount = await ArticlesModel.find({
        createdBy: userId,
        publish: true,
      }).countDocuments();

      return getBlogCount;
    } catch (err) {
      throw err;
    }
  }

  async getSingleBlog(Id) {
    try {
      const getBlogCount = await ArticlesModel.findOne({
        _id: Id,
      });

      return getBlogCount;
    } catch (err) {
      throw err;
    }
  }

  async getEndUserBlogs(page, limit) {
    try {
      const getBlogs = await ArticlesModel.paginate(
        {
          publish: true,
        },
        { ...options, page: page, limit: limit }
      );

      return getBlogs;
    } catch (err) {
      throw err;
    }
  }

  async allBlogCount() {
    try {
      const getBlogCount = await ArticlesModel.find().countDocuments();

      return getBlogCount;
    } catch (err) {
      throw err;
    }
  }

  async SearchBlogByTitle(title, page, limit) {
    try {
      const blog = await ArticlesModel.paginate(
        {
          title: { $regex: title, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return blog;
    } catch (err) {
      throw err;
    }
  }
}
