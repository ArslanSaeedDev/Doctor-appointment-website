// In your Cloudinary config file (connectCloudinary.js)
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {  // Remove async as it's not needed
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,  // Fixed typo (double underscore)
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

export default connectCloudinary;