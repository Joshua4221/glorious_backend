import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const GallerySchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    user_phone_number: { type: String },

    user_email: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user id',
      required: [true, 'Please provide user that want to verify business'],
    },

    name: {
      type: String,
    },

    email: {
      type: String,
      required: [true, 'Please provide email'],
    },

    // Phone number field with uniqueness constraint
    phone_number: {
      type: String,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },

    product_name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    price_at_time_of_addition: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: [true, 'Please provide category'],
    },

    sub_category: {
      type: String,
      required: [true, 'Please provide sub_category'],
    },

    gallery: [GallerySchema],

    thumbnail_image_pic: {
      type: String,
    },

    thumbnail_image_id: {
      type: String,
    },

    total_amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

CartSchema.plugin(mongoosePaginate);

// Create the CartModel using the defined schema
const CartModel = mongoose.model('cart', CartSchema);

export default CartModel;
