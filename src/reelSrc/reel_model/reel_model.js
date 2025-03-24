import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for the User model
const ReelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },

    link: {
      type: String,
    },

    reel_image: {
      type: String,
    },

    reel_image_id: {
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

ReelSchema.plugin(mongoosePaginate);

const ReelModel = mongoose.model('reel', ReelSchema);

export default ReelModel;
