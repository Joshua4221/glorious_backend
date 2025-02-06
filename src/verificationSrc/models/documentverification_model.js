import mongoose from "mongoose";
import validator from "validator";

const { isEmail } = validator;

// Define the schema for the User model
const DocumentSchema = new mongoose.Schema(
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

    document_name: {
      type: String,
      enum: [
        "national id",
        "voter card",
        "international passport",
        "driving lienence",
      ],
      required: [true, "Please provide a document name"],
    },

    document_number: {
      type: String,
    },

    document_front_capture: {
      type: String,
    },

    document_front_capture_id: {
      type: String,
    },

    document_back_capture: {
      type: String,
    },

    document_back_capture_id: {
      type: String,
    },

    home_address: {
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
const DocumentModel = mongoose.model("document", DocumentSchema);

export default DocumentModel;
