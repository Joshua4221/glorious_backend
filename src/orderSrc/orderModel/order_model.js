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
  totalPrice: { type: String, default: 0 },
  symbol: { type: String },
  gallery: [GallerySchema],
});

const OrderSchema = new mongoose.Schema(
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

    client_notification: { type: Number, default: 0 },

    admin_notification: { type: Number, default: 0 },

    totalPrice: { type: String, default: 0 },

    total_quantity: { type: Number, required: true, min: 1 },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },

    payment_status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

// Create the CartModel using the defined schema
const OrderModel = mongoose.model('order', OrderSchema);

export default OrderModel;
