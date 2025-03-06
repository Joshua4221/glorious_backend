import { StatusCodes } from 'http-status-codes';
import {
  UploadThroughCloudinary,
  deleteCloudItem,
} from '../../utils/updateToCloudinary.js';
import { convertImageToBase64 } from '../../utils/converterToBase64.js';

export const CloudinaryApiProvider = (app) => {
  app.post('/api/v1/upload_through_cloudinary', async (req, res, next) => {
    try {
      const { file } = req.body;

      const data = await UploadThroughCloudinary(file);

      res.status(StatusCodes.OK).json({ message: 'success', data: data });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.post('/api/v1/cloudinary_file_upload', async (req, res, next) => {
    try {
      const { file } = req.files;

      const base64Image = await convertImageToBase64(file);

      const data = await UploadThroughCloudinary(base64Image);

      res.status(StatusCodes.OK).json({ message: 'success', data: data });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.post('/api/v1/cloudinary_file_upload', async (req, res, next) => {
    try {
      const { file } = req.files;

      const base64Image = await convertImageToBase64(file);

      const data = await UploadThroughCloudinary(base64Image);

      res.status(StatusCodes.OK).json({ message: 'success', data: data });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.post(
    '/api/v1/cloudinary_multiple_file_upload',
    async (req, res, next) => {
      try {
        const { file } = req.files;

        if (Array.isArray(file)) {
          const uploadPromises = await file.map(async (pic) => {
            const base64Image = await convertImageToBase64(pic);

            const data = await UploadThroughCloudinary(base64Image);

            return data;
          });

          const results = await Promise.all(uploadPromises);

          res
            .status(StatusCodes.OK)
            .json({ message: 'success', data: results });
        } else {
          const base64Image = await convertImageToBase64(file);

          const data = await UploadThroughCloudinary(base64Image);

          res.status(StatusCodes.OK).json({ message: 'success', data: [data] });
        }
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.delete('/api/v1/delete_from_cloudinary', async (req, res, next) => {
    try {
      const { cloudinary_id } = req.body;

      const data = await deleteCloudItem(cloudinary_id);

      if (data.result === 'not found') {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'wrong id passed' });
      }

      res.status(StatusCodes.OK).json({ message: 'success', data: data });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};
