import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

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

const MessageSchema = new mongoose.Schema(
  {
    content: String,
    from: Object,
    socketid: String,
    time: String,
    date: String,
    image: { type: Boolean, default: false },
    imageDetails: [ImageSchema],
    to: String,
    symbol: { type: String },
    totalPrice: { type: String, default: 0 },
    products: [ProductSchema],
    product_details: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

export default Message;
