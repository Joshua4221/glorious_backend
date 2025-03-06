import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  pic_url: { type: String },
  pic_id: { type: String },
});

const NormalMessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  image: { type: Boolean, default: false },
  imageDetails: [ImageSchema],
  to: String,
});

const NormalMessage = mongoose.model('Normal-Message', NormalMessageSchema);

export default NormalMessage;
