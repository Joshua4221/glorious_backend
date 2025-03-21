import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for the User model
const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },

    review: {
      type: String,
    },

    pic_image: {
      type: String,
    },

    pic_image_id: {
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

ReviewSchema.plugin(mongoosePaginate);

const ReviewModel = mongoose.model('review', ReviewSchema);

export default ReviewModel;
