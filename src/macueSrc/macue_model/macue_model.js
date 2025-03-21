import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Define the schema for the User model
const MacueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
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

MacueSchema.plugin(mongoosePaginate);

const MacueModel = mongoose.model('macue', MacueSchema);

export default MacueModel;
