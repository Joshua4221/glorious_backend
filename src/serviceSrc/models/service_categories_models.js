import mongoose from "mongoose";

const ServicesCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Please provide a Category"],
      unique: true,
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the UserModel using the defined schema
const ServiceCategoriesModel = mongoose.model(
  "Services_Category",
  ServicesCategorySchema
);

export default ServiceCategoriesModel;
