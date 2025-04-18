import { StatusCodes } from 'http-status-codes';
import cloudinary from '../config/cloudinary.js';
import UserModel from '../src/authSrc/models/user.js';

export const UploadThroughCloudinary = async (pic) => {
  try {
    const result = await cloudinary.uploader.upload(pic, {
      folder: 'glorious_evidence',
      resource_type: 'auto',
      raw_convert: 'aspose',
    });

    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteCloudItem = async (cloudinary_id) => {
  try {
    const asset = await cloudinary.uploader.destroy(cloudinary_id);

    return asset;
  } catch (err) {
    throw err;
  }
};
