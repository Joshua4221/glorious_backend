import ReviewModel from '../review_models/review_models.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class ReviewController {
  async createReview(payload) {
    try {
      const review = await ReviewModel.create({ ...payload });

      return review;
    } catch (err) {
      throw err;
    }
  }

  async SingleReview(payload) {
    try {
      const review = await ReviewModel.findOne({
        _id: payload._id,
      });

      return review;
    } catch (err) {
      throw err;
    }
  }

  async getReview(page, limit) {
    try {
      const review = await ReviewModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return review;
    } catch (err) {
      throw err;
    }
  }

  async getAllMajorReview() {
    try {
      const review = await ReviewModel.find();

      return review;
    } catch (err) {
      throw err;
    }
  }

  async EditReview(payload, id) {
    try {
      const review = await ReviewModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return review;
    } catch (err) {
      throw err;
    }
  }

  async deleteReview(Id) {
    try {
      const review = await ReviewModel.findByIdAndDelete({
        _id: Id,
      });

      return review;
    } catch (err) {
      throw err;
    }
  }

  async SearchReviewByName(name, page, limit) {
    try {
      const review = await ReviewModel.paginate(
        {
          name: { $regex: name, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return review;
    } catch (err) {
      throw err;
    }
  }
}
