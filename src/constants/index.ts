import dotenv from "dotenv";

dotenv.config();

const constants = {
  PORT: Number(process.env.PORT) || 3000,

  SERVER_URL: process.env.SERVER_URL || '',

  MONGO_URI: process.env.MONGO_URI || '',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

export default constants;
