import ServiceBookingModel from "../models/booked_services_model.js";

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: "-date",
  collation: {
    locale: "en",
  },
};

export default class BookingServiceController {
  async CreateService(payload) {
    try {
      const user = await ServiceBookingModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async getMyBookings(page, limit, id) {
    try {
      const getServices = await ServiceBookingModel.paginate(
        {
          // publish: true,
          BookedById: id,
        },
        { ...options, page: page, limit: limit }
      );

      return getServices;
    } catch (err) {
      throw err;
    }
  }

  async getOtherBookings(page, limit, id) {
    try {
      const getServices = await ServiceBookingModel.paginate(
        {},
        { ...options, page: page, limit: limit }
      );

      return getServices;
    } catch (err) {
      throw err;
    }
  }

  async EditService(payload, id) {
    try {
      const user = await ServiceBookingModel.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      return user;
    } catch (err) {
      throw err;
    }
  }

  async SingleBookingService(payload) {
    try {
      const service = await ServiceBookingModel.findOne({
        _id: payload.title,
      });

      return service;
    } catch (err) {
      throw err;
    }
  }
}
