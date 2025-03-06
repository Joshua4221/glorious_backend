import { CommentModel } from "../models/comments.js";

export default class CommentService {
  async createComment(payload) {
    try {
      const createComment = await CommentModel.create({ ...payload });

      return createComment;
    } catch (err) {
      throw err;
    }
  }

  async blogComments(Id) {
    try {
      const blogcomments = await CommentModel.find({
        postId: Id,
      }).sort("-date");

      return blogcomments;
    } catch (err) {
      throw err;
    }
  }

  async blogCommentsCount(Id) {
    try {
      const blogcomments = await CommentModel.find({
        postId: Id,
      }).countDocuments();

      return blogcomments;
    } catch (err) {
      throw err;
    }
  }
}
