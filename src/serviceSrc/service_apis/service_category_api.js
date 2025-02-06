import { StatusCodes } from "http-status-codes";
import ServiceController from "../services/serviceProvider.js";
import { authenticateUser } from "../../../utils/authentication.js";
import ServiceCategoriesModel from "../models/service_categories_models.js";

export const ServiceCategoryApiProvider = (app) => {
  app.get(
    "/api/v1/services_category",
    authenticateUser,
    async (req, res, next) => {
      try {
        const findAllCategory = await ServiceCategoriesModel.find();

        res
          .status(StatusCodes.CREATED)
          .send({ message: "Success", data: findAllCategory });
      } catch (error) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );
};
