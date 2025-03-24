import ReelModel from '../reel_model/reel_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class ReelController {
  async CreateReel(payload) {
    try {
      const reel = await ReelModel.create({ ...payload });

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async SingleReel(payload) {
    try {
      const reel = await ReelModel.findOne({
        _id: payload._id,
      });

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async getReel(page, limit) {
    try {
      const reel = await ReelModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async getAllMajorReel() {
    try {
      const reel = await ReelModel.find();

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async EditReel(payload, id) {
    try {
      const reel = await ReelModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async deleteReel(Id) {
    try {
      const reel = await ReelModel.findByIdAndDelete({
        _id: Id,
      });

      return reel;
    } catch (err) {
      throw err;
    }
  }

  async SearchReelByTitle(title, page, limit) {
    try {
      const reel = await ReelModel.paginate(
        {
          title: { $regex: title, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return reel;
    } catch (err) {
      throw err;
    }
  }
}
