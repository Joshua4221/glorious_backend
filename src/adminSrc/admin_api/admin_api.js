import { StatusCodes } from 'http-status-codes';
import AdminController from '../admin_services/admin_services.js';
import AdminModel from '../admin_models/admin_models.js';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';

export const adminApiProvider = (app) => {
  const adminServices = new AdminController();

  // Registration API endpoint
  app.post(
    '/api/v1/create_admin',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        if (req?.body?.adminType === 'root_admin') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: `This Admin level cans't be created`,
          });
        }

        if (
          req?.user?.admintype === 'normal_two_admin' ||
          req?.user?.admintype === 'normal_two_admin' ||
          req?.user?.admintype === 'order_admin'
        ) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of your ADMIN Level you can not create a user.',
          });
        }

        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of your ADMIN Status you can not create a user.',
          });
        }

        // Check if required fields are provided
        if (!req.body.email || !req.body.password) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: 'Please provide email, phone number, and password',
          });
        }

        // Check if email or phone number already exists
        const alreadySaved = await AdminModel.findOne({
          email: req.body.email,
        });

        if (alreadySaved) {
          return res.status(StatusCodes.UNAUTHORIZED).send({
            message: 'email already exists',
          });
        }

        // Create user and generate OTP
        const user = await adminServices.CreateUser({
          ...req.body,
          adminName: req?.user?.name,
          adminEmail: req?.user?.email,
        });

        return res
          .status(StatusCodes.CREATED)
          .send({ message: 'success', data: user });
      } catch (err) {
        // Handle errors
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  // Login API endpoint
  app.post('/api/v1/login_admins', async (req, res, next) => {
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
      const users = await AdminModel.findByCredentials(email, password);

      // Return success response with user data and token
      res
        .status(StatusCodes.OK)
        .json({ message: 'success', data: users[0], token: users[1] });
    } catch (error) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};
