import mongoose from "mongoose";
import validator from "validator";

import mongoosePaginate from "mongoose-paginate-v2";

const { isEmail } = validator;

const DaysSchema = new mongoose.Schema({
  from: { type: String },
  to: { type: String },
  slots: { type: String },
});

// const AvaliabilitySchema = new mongoose.Schema({
//   day: { type: [DaysSchema], default: [] },
// });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },

  phone_number: {
    type: String,
    unique: true,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User id",
    required: [true, "Please provide User"],
    unique: true,
  },

  profile_pic: {
    type: String,
  },

  cloudinary_id: {
    type: String,
  },

  amount: {
    type: Number,
  },
});

const AdditionalServiceSchema = new mongoose.Schema({
  serice_item: { type: String },
  price: { type: String },
  duration: { type: String },
});

const GallerySchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const CarSchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const Bid_Pic = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

// const ratingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Types.ObjectId, required: true }, // Assuming you have a user system with user IDs
//   provideId: { type: mongoose.Types.ObjectId, required: true }, // ID of the item being rated
//   rating: { type: Number, required: true, min: 1, max: 5 }, // Rating scale from 1 to 5
//   createdAt: { type: Date, default: Date.now },
//   review: { type: String },
// });

// Define the schema for the User model
const BidBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: [isEmail, "invalid Email"],
    },

    // Phone number field with uniqueness constraint
    phone_number: {
      type: String,
      required: [true, "Please provide phone number"],
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user id",
      required: [true, "Please provide user"],
    },

    servicesId: {
      type: mongoose.Types.ObjectId,
      ref: "Services id",
      required: [true, "Please provide Services"],
    },

    booker_name: {
      type: String,
    },

    booker_email: {
      type: String,
      required: [true, "Please provide email"],
      validate: [isEmail, "invalid Email"],
    },

    // Phone number field with uniqueness constraint
    booker_phone_number: {
      type: String,
      // required: [true, "Please provide booker phone number"],
    },

    BookedById: {
      type: mongoose.Types.ObjectId,
      ref: "booked user id",
      required: [true, "Please provide book user id"],
    },

    BookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking id",
      required: [true, "Please provide booking id"],
    },

    bid_creator_Id: {
      type: mongoose.Types.ObjectId,
      ref: "bid creator id",
      required: [true, "Please provide bid creator id"],
    },

    bid_creator_email: {
      type: String,
    },

    bid_creator_name: {
      type: String,
    },

    bid_creator_phone: {
      type: String,
    },

    service_title: {
      type: String,
      required: [true, "Please provide a Service title"],
    },

    category: {
      type: String,
      required: [true, "Please provide category"],
    },

    sub_category: {
      type: String,
      required: [true, "Please provide sub_category"],
    },

    price: {
      type: String,
      required: [true, "Please provide price"],
    },

    duration: {
      type: String,
      required: [true, "Please provide duration"],
    },

    description: {
      type: String,
      required: [true, "Please provide Description"],
    },

    video_uri: {
      type: String,
    },

    additional_services: [AdditionalServiceSchema],

    availability: {
      type: Map,
      of: [DaysSchema],
      default: {},
    },

    address: { type: String },

    country: { type: String },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    booker_address: { type: String },

    booker_country: { type: String },

    booker_city: {
      type: String,
    },

    booker_state: {
      type: String,
    },

    pincode: { type: String },

    googleMapPlaceId: {
      type: String,
    },

    longitude: {
      type: String,
    },

    latitude: {
      type: String,
    },

    meta_title: {
      type: String,
    },

    meta_keywords: {
      type: String,
    },

    meta_description: {
      type: String,
    },

    gallery: [GallerySchema],

    booking_car_shape: [CarSchema],

    booking_status: { type: String, default: "active" },

    booking_delete: { type: Boolean, default: false },

    booking_deactivate: { type: Boolean, default: false },

    booking_date: { type: Date, default: Date.now },

    booked_date: { type: String },

    booked_time: { type: String },

    desputed: { type: Boolean, default: false },

    adminToVerify: {
      type: mongoose.Types.ObjectId,
      ref: "admin id",
    },

    adminName: {
      type: String,
    },

    adminEmail: {
      type: String,
    },

    desputed_adminToVerify: {
      type: mongoose.Types.ObjectId,
      ref: "admin id",
    },

    desputed_adminName: {
      type: String,
    },

    desupted_adminEmail: {
      type: String,
    },

    indicator: {
      type: String,
      default: "online",
    },

    booked_notices: {
      type: Boolean,
      default: false,
    },

    payment_status: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
    },

    amount_range_Start: {
      type: Number,
    },

    amount_range_end: {
      type: Number,
    },

    amount_currency: {
      type: Number,
    },

    bidder: [userSchema],

    bid_time: {
      type: String,
    },

    bid_pic: [Bid_Pic],

    bid_video_uri: { type: String },
  },
  { timestamps: true }
);

BidBookingSchema.plugin(mongoosePaginate);

// Create the UserModel using the defined schema
const BidBookingModel = mongoose.model("bid_booking", BidBookingSchema);

export default BidBookingModel;
