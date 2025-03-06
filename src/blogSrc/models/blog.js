import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const ArticleImageSchema = new Schema({
  url: { type: String },
  cloudinary_id: { type: String },
});

const ViewSchema = new Schema({
  username: { type: String },
  profile_pic: { type: String },
});

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, 'please provide title'],
    },

    article: {
      type: String,
      require: [true, 'please provide article'],
    },

    cover_pic: {
      type: String,
    },

    publish: { type: Boolean, default: true },

    date: { type: Date, default: Date.now },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },

    hash_tag: { type: String },

    fullname: {
      type: String,
    },

    email: {
      type: String,
    },

    profile_pic: {
      type: String,
    },

    cover_pic_id: {
      type: String,
    },

    wordCount: {
      type: String,
    },

    facebook: { type: String },

    twitter: { type: String },

    linkedin: { type: String },

    instagram: { type: String },

    article_Image_cloud: [ArticleImageSchema],

    view: { count: { type: Number, default: 0 }, details: [ViewSchema] },
  },
  { timestamps: true }
);

ArticleSchema.plugin(mongoosePaginate);

export const ArticlesModel = mongoose.model('Articles', ArticleSchema);
