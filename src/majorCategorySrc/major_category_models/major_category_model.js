import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for the User model
const MajorCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },

    slug: {
      type: String,
    },

    description: {
      type: String,
    },

    category_image: {
      type: String,
    },

    category_image_id: {
      type: String,
    },

    date: { type: Date, default: Date.now },

    editedAdminEmail: {
      type: String,
    },

    adminEmail: {
      type: String,
    },

    adminName: {
      type: String,
    },

    adminId: {
      type: mongoose.Types.ObjectId,
      ref: 'admin id',
      required: [true, 'Please provide admin id'],
    },
  },
  { timestamps: true }
);

MajorCategorySchema.plugin(mongoosePaginate);

const MajorCatgoryModel = mongoose.model('major_category', MajorCategorySchema);

export default MajorCatgoryModel;
