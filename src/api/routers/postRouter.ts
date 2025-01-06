import express from "express";
import PostController from "../controllers/PostController";
import { upload } from "../middlewares/multerConfig";

const router = express.Router();

// Route to create a new post
router.post("/post", upload.single("image"), PostController.createPost);

// Route to delete a post
router.delete("/post/:id", PostController.deletePost);


// Route to fetching a posts with filters and pagination
router.get("/post", PostController.getPosts);

export default router;
