import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (req, file) => `posts/${file.originalname}`,
  },
});

export const upload = multer({ storage });
