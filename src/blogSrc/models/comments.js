import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    image: String,
    username: String,
    comment: String,
    profile_pic: String,
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: [true, "Please provide post"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("Comment", CommentSchema);
