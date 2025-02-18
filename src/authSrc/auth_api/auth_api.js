import { StatusCodes } from 'http-status-codes';
import AuthController from '../services/auth_services.js';
import UserModel from '../models/user.js';

export const authApiProvider = (app) => {
  const authService = new AuthController();

  // Registration API endpoint
  app.post('/api/v1/registration', async (req, res, next) => {
    try {
      // Check if required fields are provided
      if (!req.body.email || !req.body.password) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Please provide email, phone number, and password',
        });
      }

      // Check if email or phone number already exists
      const alreadySaved = await UserModel.findOne({ email: req.body.email });

      if (alreadySaved) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'email already exists',
        });
      }

      // Create user and generate OTP
      const user = await authService.CreateUser({
        ...req.body,
      });

      // Return success response
      return res
        .status(StatusCodes.CREATED)
        .send({ message: 'Success', data: user });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  // Login API endpoint
  app.post('/api/v1/login', async (req, res, next) => {
    try {
      // Extract email and password from the request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Please provide email and password' });
      }

      // Find users by credentials (email and password)
      const users = await UserModel.findByCredentials(email, password);

      // Return success response with user data and token
      res
        .status(StatusCodes.OK)
        .json({ message: 'Success', data: users[0], token: users[1] });
    } catch (error) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};
