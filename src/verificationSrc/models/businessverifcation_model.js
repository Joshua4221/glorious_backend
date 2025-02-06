import mongoose from "mongoose";
import validator from "validator";

const { isEmail } = validator;

// Define the schema for the User model
const BusinessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: [isEmail, "invalid Email"],
      unique: true,
    },

    user_type: {
      type: String,
    },

    business_name: {
      type: String,
      required: [true, "Please provide a business name"],
    },

    certificate_number: {
      type: String,
    },

    trade_certificate: {
      type: String,
    },

    trade_certificate_id: {
      type: String,
    },

    business_type: {
      type: String,
    },

    home_address: {
      type: String,
    },

    year_of_experience: {
      type: Number,
    },

    business_address: {
      type: String,
    },

    verify_by: {
      type: mongoose.Types.ObjectId,
      ref: "user id",
      required: [true, "Please provide user that want to verify business"],
      unique: true,
    },

    verify_document: { type: String, default: "pending" },

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

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the UserModel using the defined schema
const BusinessModel = mongoose.model("business", BusinessSchema);

export default BusinessModel;
