import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for the User model
const CategorySchema = new mongoose.Schema(
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

CategorySchema.plugin(mongoosePaginate);

const CatgoryModel = mongoose.model('category', CategorySchema);

export default CatgoryModel;
