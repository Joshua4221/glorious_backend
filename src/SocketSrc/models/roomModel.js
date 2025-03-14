import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const ProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  product_name: {
    type: String,
  },
  quantity: { type: Number, min: 1 },
  price: { type: String },
  totalPrice: { type: String, default: 0 },
  symbol: { type: String },
  gallery: [GallerySchema],
});

const RoomsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
    },

    email: {
      type: String,
      required: [true, "Can't be blank"],
    },

    phone_number: {
      type: String,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user id',
      required: [true, 'Please provide user that want to verify business'],
    },

    picture: {
      type: String,
    },

    roomOwner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

    room: {
      type: String,
      unique: true,
      required: [true, 'Please provide room'],
    },

    order_title: {
      type: String,
    },

    order_id: {
      type: mongoose.Types.ObjectId,
      ref: 'order id',
      required: [true, 'Please provide Order Id'],
    },

    date: { type: Date, default: Date.now },

    lastTime: { type: Date, default: Date.now },

    status: {
      type: String,
      default: 'online',
    },

    product_status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },

    payment_status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },

    lastMessage: {
      type: String,
    },

    products: [ProductSchema],

    symbol: { type: String },

    totalPrice: { type: String, default: 0 },

    notification: { type: Number, default: 0 },

    client_notification: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Rooms = mongoose.model('Rooms', RoomsSchema);

export default Rooms;
