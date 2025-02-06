import BidBookingModel from "../models/bid_booking_model.js";

const options = {
  page: 1,
  limit: 2,
  lean: true,
  sort: "-date",
  collation: {
    locale: "en",
  },
};
export default class BidBookingServiceController {
  async CreateBidService(payload) {
    try {
      const user = await BidBookingModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async getOtherBookings(page, limit, id) {
    try {
      const getServices = await BidBookingModel.paginate(
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
      const user = await BidBookingModel.findOneAndUpdate(
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
      const service = await BidBookingModel.findOne({
        _id: payload.title,
      });

      return service;
    } catch (err) {
      throw err;
    }
  }
}
