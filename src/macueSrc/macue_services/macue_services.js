import MacueModel from '../macue_model/macue_model.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: '-date',
  collation: {
    locale: 'en',
  },
};

export default class MacueController {
  async createMacue(payload) {
    try {
      const macue = await MacueModel.create({ ...payload });

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async SingleMacue(payload) {
    try {
      const macue = await MacueModel.findOne({
        _id: payload._id,
      });

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async getMacue(page, limit) {
    try {
      const macue = await MacueModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async getAllMajorMacue() {
    try {
      const macue = await MacueModel.find();

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async EditMacue(payload, id) {
    try {
      const macue = await MacueModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async deleteMacue(Id) {
    try {
      const macue = await MacueModel.findByIdAndDelete({
        _id: Id,
      });

      return macue;
    } catch (err) {
      throw err;
    }
  }

  async SearchMacueByName(title, page, limit) {
    try {
      const macue = await MacueModel.paginate(
        {
          title: { $regex: title, $options: 'i' },
        },
        { ...options, page: page, limit: limit }
      );

      return macue;
    } catch (err) {
      throw err;
    }
  }
}
