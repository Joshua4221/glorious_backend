import mongoose from 'mongoose';

// Define the schema for the User model
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },

    slug: {
      type: String,
    },

    category_image: {
      type: String,
    },

    category_image_id: {
      type: String,
    },

    category_image: {
      type: String,
    },

    category_image_id: {
      type: String,
    },

    category_icon: {
      type: String,
    },

    category_icon_id: {
      type: String,
    },

    category_name: {
      type: String,
    },

    categroyId: {
      type: mongoose.Types.ObjectId,
      ref: 'category id',
      required: [true, 'Please provide category id'],
    },

    date: { type: Date, default: Date.now },

    adminEmail: {
      type: String,
    },

    adminName: {
      type: String,
    },
  },
  { timestamps: true }
);

const SubCatgoryModel = mongoose.model('sub_category', SubCategorySchema);

export default SubCatgoryModel;
