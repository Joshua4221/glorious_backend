import mongoose from "mongoose";
import validator from "validator";

const { isEmail } = validator;

// Define the schema for the User model
const FaceSchema = new mongoose.Schema(
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

    face_capture: {
      type: String,
    },

    face_capture_id: {
      type: String,
    },

    verify_by: {
      type: mongoose.Types.ObjectId,
      ref: "user id",
      required: [true, "Please provide user that want to verify business"],
      unique: true,
    },

    verify_business: { type: String, default: "pending" },

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
const FaceModel = mongoose.model("face_verification", FaceSchema);

export default FaceModel;
