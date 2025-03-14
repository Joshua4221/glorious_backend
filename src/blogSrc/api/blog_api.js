import { StatusCodes } from 'http-status-codes';
import BlogService from '../services/blogServices.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';

export const blogApiConnections = (app) => {
  const blogService = new BlogService();

  app.post(
    '/api/v1/create_blog',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        if (!req.body.title || !req.body.article) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: 'all field must be filled' });
        }

        req.body.createdBy = req.user.userId;

        const article = await blogService.createBlog({
          ...req.body,
          fullname: req.user.name,
          email: req.user.email,
          profile_pic: req.user.profile_pic,
        });

        res
          .status(StatusCodes.CREATED)
          .json({ data: article, message: 'success' });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_blog',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const getSingleBlog = await blogService.getSingleBlog(req.body._id);

        if (!getSingleBlog) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'this is Article does not exit please check again',
          });
        }

        const article = await blogService.editBlog(getSingleBlog?._id, {
          ...req.body,
        });

        res
          .status(StatusCodes.CREATED)
          .json({ data: article, message: 'success' });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get('/api/v1/get_blogs/:page/:limit', async (req, res, next) => {
    try {
      const { limit, page } = req.params;

      const count = await blogService.blogCount();

      const allArticle = await blogService.getBlogs(
        Number(page),
        Number(limit)
      );

      res
        .status(StatusCodes.OK)
        .json({ data: allArticle, count: count, message: 'success' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_my_blogs/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { page, limit } = req.params;

        const user = req.user;

        const count = await blogService.myBlogCount(user.userId);

        const allArticle = await blogService.getMyBlogs(
          Number(page),
          Number(limit),
          user.userId
        );

        res
          .status(StatusCodes.OK)
          .json({ data: allArticle, count: count, message: 'success' });
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get('/api/v1/get_single_post/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      const blogId = id.split('@')[id.split('@').length - 1];

      console.log(blogId, 'super');

      const article = await blogService.getSingleBlog(blogId);

      if (!article) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'this does not exit' });
      }

      console.log(article, 'nic nix');

      res.status(StatusCodes.OK).json({ data: article, message: 'success' });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.get('/api/v1/get_all_blogs/:limit', async (req, res, next) => {
    try {
      const { limit } = req.params;

      const count = await blogService.blogCount();

      const allArticle = await blogService.getBlogs(Number(limit));

      res
        .status(StatusCodes.OK)
        .json({ data: allArticle, count: count, message: 'success' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_enduser_blog/:page/:limit', async (req, res, next) => {
    try {
      const { page, limit } = req.params;

      const allArticle = await blogService.getEndUserBlogs(
        Number(page),
        Number(limit)
      );

      res.status(StatusCodes.OK).json({ data: allArticle, message: 'success' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_blog_count', async (req, res, next) => {
    try {
      const allArticle = await blogService.allBlogCount();

      res.status(StatusCodes.OK).json({ data: allArticle, message: 'success' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};
