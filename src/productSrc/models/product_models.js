import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const GallerySchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

// Define the schema for the User model
const ProductSchema = new mongoose.Schema(
  {
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

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user id',
      required: [true, 'Please provide user that want to verify business'],
    },

    product_name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },

    category: {
      type: String,
      required: [true, 'Please provide category'],
    },

    brand: {
      type: String,
      required: [true, 'Please provide sub_category'],
    },

    currency: {
      type: String,
      required: [true, 'Please provide price'],
    },

    symbol: {
      type: String,
      required: [true, 'Please provide price'],
    },

    price: {
      type: String,
      required: [true, 'Please provide price'],
    },

    discount: {
      type: String,
    },

    tex_price: {
      type: String,
    },

    quantity: {
      type: String,
      required: [true, 'Please provide price'],
    },

    tags: {
      type: String,
    },

    description: {
      type: String,
      required: [true, 'Please provide Description'],
    },

    gallery: [GallerySchema],

    status: { type: String, default: 'active' },

    delete: { type: Boolean, default: false },

    date: { type: Date, default: Date.now },

    indicator: {
      type: String,
      default: 'online',
    },

    admin_name: {
      type: String,
    },

    admin_email: {
      type: String,
    },

    admin_Edited_By: {
      type: mongoose.Types.ObjectId,
      ref: 'admin id',
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

// Create the UserModel using the defined schema
const ProductModel = mongoose.model('product', ProductSchema);

export default ProductModel;
