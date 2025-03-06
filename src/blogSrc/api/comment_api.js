import { StatusCodes } from 'http-status-codes';
import CommentService from '../services/commentServices.js';
import BlogService from '../services/blogServices.js';
import { authenticateUserAdmin } from '../../../utils/authenticate_user.js';

export const commentApiConnections = (app) => {
  const commentService = new CommentService();
  const blogServices = new BlogService();

  app.post(
    '/comment/:postId',
    authenticateUserAdmin,
    async (req, res, next) => {
      try {
        const { userId, fullname } = req.user;

        const { postId } = req.params;

        if (!postId) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'require post id' });
        }

        const postState = await blogServices.getSingleBlog(postId);

        if (!postState) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'no such post found' });
        }

        if (!req.body.comment) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'no comment found' });
        }

        const post = await commentService.createComment({
          ...req.body,
          postId: postId,
          createdBy: userId,
          fullname: fullname,
        });

        res
          .status(StatusCodes.CREATED)
          .json({ data: post, message: 'success' });
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post('/comment_by_user/:postId', async (req, res, next) => {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'require post id' });
      }

      const postState = await blogServices.getSingleBlog(postId);

      if (!postState) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'no such post found' });
      }

      if (!req.body.comment) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'no comment found' });
      }

      const post = await commentService.createComment({
        ...req.body,
        postId: postId,
      });

      res.status(StatusCodes.CREATED).json({ data: post, message: 'success' });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/single_post_comment/:postId', async (req, res, next) => {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'require post id' });
      }

      const postState = await blogServices.getSingleBlog(postId);

      if (!postState) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'no such post found' });
      }

      const comment = await commentService.blogComments(postId);

      const commentCount = await commentService.blogCommentsCount(postId);

      res.status(StatusCodes.OK).json({
        data: { data: comment, count: commentCount },
        message: 'success',
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};
