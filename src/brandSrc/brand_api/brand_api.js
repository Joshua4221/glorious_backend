import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import BrandController from '../brand_services/brand_services.js';
import BrandModel from '../brand_model/brand_model.js';

export const BrandApiProvider = (app) => {
  const brandServices = new BrandController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_brand',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        // Check if required fields are provided
        if (!req.body.name) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide Brand name',
          });
        }

        const brandName = await BrandModel.findOne({
          name: req.body.name,
        });

        if (brandName) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Brand with name already exist',
          });
        }

        const brand = await brandServices.BrandCategory({
          ...req.body,
          adminEmail: user?.email,
          adminId: user?._id,
          adminName: user?.name,
        });

        // Return success response
        res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: brand });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get('/api/v1/get_all_brand/:page/:limit', async (req, res, next) => {
    try {
      const brand = await brandServices.getBrand();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: brand });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get('/api/v1/get_all_major_brand', async (req, res, next) => {
    try {
      const brand = await brandServices.getAllMajorBrand();

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success', data: brand });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });

  app.get(
    '/api/v1/get_single_brand/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const brand = await brandServices.SingleBrand({
          _id: Id,
        });

        if (!brand) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'brand is not available',
          });
        }

        // Return success response
        res.status(StatusCodes.OK).send({ message: 'success', data: brand });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.patch(
    '/api/v1/edit_brand/:brandId',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const user = req.user;

        const { brandId } = req.params;

        const brand = await BrandModel.findOne({
          _id: brandId,
        });

        if (!brand) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'brand does not exists',
          });
        }

        const brand_state = await brandServices.EditBrand(
          { ...req.body, editedAdminEmail: user?.email },
          brandId
        );

        res
          .status(StatusCodes.OK)
          .send({ message: 'success', data: brand_state });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.post(
    '/api/v1/delete_brand',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const brandId = req.body.id;

        const brand = await BrandModel.findOne({
          _id: brandId,
        });

        if (!brand) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'brand does not exists',
          });
        }

        const editedDetials = await brandServices.deleteBrand(brandId);

        res
          .status(StatusCodes.OK)
          .json({ data: editedDetials, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/search_for_brand_by_name/:name/:page/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { name, page, limit } = await req.params;

        const brand = await brandServices.SearchBrandByName(name, page, limit);

        res.status(StatusCodes.OK).json({ data: brand, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
