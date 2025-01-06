import { PostType } from "../types/postType";
import mongoose, { Schema, Model, model } from "mongoose";

const postSchema: Schema = new Schema<PostType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  {
    timestamps: true,
  }
);

const Post: Model<PostType> = model<PostType>("Post", postSchema);

export default Post;
