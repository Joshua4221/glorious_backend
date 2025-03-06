import { v2 as cloudinary } from "cloudinary";
import { configs } from "../../../config/index.js";

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = configs;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
  secure: true,
});

export default cloudinary;
