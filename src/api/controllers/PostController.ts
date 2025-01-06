import { Request, Response } from "express";
import Post from "../models/postModel";
import cloudinary from "../../config/cloudinaryConfig";
import Tag from "../models/tagModel";

class PostController {
  //API : /api/v1/post
  //Method : POST
  //Access : Public
  //Description : Add new post
  createPost = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      let { tags } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          status: false,
          message: "title and description is required",
        });
      }

      // Upload image to Cloudinary
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          status: false,
          message: "Image is not uploaded",
        });
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "posts",
      });

      // Process tags
      let tagIds: any = [];
      if (!Array.isArray(tags) && typeof tags === "string") {
        tags = tags.split(",").map((tag) => tag.trim());
      }
      if (tags && Array.isArray(tags)) {
        tagIds = await Promise.all(
          tags.map(async (tagName: string) => {
            let tag = await Tag.findOne({ name: tagName });
            if (!tag) {
              // Create a new tag if it doesn't exist
              tag = new Tag({ name: tagName });
              await tag.save();
            }
            return tag._id;
          })
        );
      }

      const newPost = new Post({
        title,
        description,
        imageUrl: result.secure_url,
        imageId: result.public_id,
        tags: tagIds,
      });

      await newPost.save();
      res.status(201).json({ success: true, post: newPost });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  //API : /api/v1/post/:id
  //Method : DELETE
  //Access : Public
  //Description : Delete post
  deletePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Post not found" });
      }

      await cloudinary.uploader.destroy(post.imageId);

      await Post.findByIdAndDelete(id);
      res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  //API : /api/v1/post
  //Method : GET
  //Access : Public
  //Description : Get multipe posts
  getPosts = async (req: Request, res: Response) => {
    try {
      const { sort, page = 1, limit = 10, keyword, tag } = req.query;

      const query: any = {};
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      }
      if (tag) {
        const foundTag = await Tag.findOne({ name: tag });
        if (!foundTag) {
          return res.status(404).json({
            status: false,
            message: "Invalid Tags: Tags not found",
          });
        }
        query.tags = foundTag._id;
      }

      const sortOption: any =
        sort === "asc" ? { createdAt: 1 } : { createdAt: -1 };

      const posts = await Post.find(query)
        .sort(sortOption)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("tags");
      
      const totalPosts = await Post.countDocuments(query);

      res.status(200).json({
        posts,
        pagination: {
          totalPosts,
          page,
          limit,
          sort
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
}

export default new PostController();
