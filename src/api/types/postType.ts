import { ObjectId } from "mongoose";

export type PostType = {
  title: string;
  description: string;
  imageUrl: string;
  imageId: string;
  tags: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};
