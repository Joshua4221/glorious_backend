import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const GallerySchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const ProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  product_name: {
    type: String,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: String, required: true },
  discount: { type: String, required: true },
  totalPrice: { type: String, default: 0 },
  totalDiscount: { type: String, default: 0 },
  symbol: { type: String },
  gallery: [GallerySchema],
});

const CartSchema = new mongoose.Schema(
  {
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

    products: [ProductSchema],

    symbol: { type: String },

    totalPrice: { type: String, default: 0 },

    totalDiscount: { type: String, default: 0 },
  },
  { timestamps: true }
);

CartSchema.plugin(mongoosePaginate);

// Create the CartModel using the defined schema
const CartModel = mongoose.model('cart', CartSchema);

export default CartModel;
