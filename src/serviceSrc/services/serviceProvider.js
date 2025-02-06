import ServiceModel from "../models/service_models.js";

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: "-date",
  collation: {
    locale: "en",
  },
};
export default class ServiceController {
  async CreateService(payload) {
    try {
      const user = await ServiceModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async SingleService(payload) {
    try {
      const service = await ServiceModel.findOne({
        service_title: payload.title,
      });

      return service;
    } catch (err) {
      throw err;
    }
  }

  async getMyServices(page, limit, id) {
    try {
      const getServices = await ServiceModel.find();

      return getServices;
    } catch (err) {
      throw err;
    }
  }

  async EditService(payload, id) {
    try {
      const user = await ServiceModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        runValidators: true,
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
}
