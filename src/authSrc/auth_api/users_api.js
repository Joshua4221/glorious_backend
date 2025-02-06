import { StatusCodes } from 'http-status-codes';
import { authenticateUser } from '../../../utils/authentication.js';
import UserService from '../services/user_services.js';

// API endpoint for getting user information
export const userApiProvider = (app) => {
  const userService = new UserService();
  // HTTP GET request to /api/v1/get_user
  // Middleware authenticateUser is used for user authentication
  app.get('/api/v1/get_user', authenticateUser, async (req, res, next) => {
    try {
      // Extract userId from the authenticated user's request
      const user = req.user;

      // Return user data as JSON in the response
      res.status(StatusCodes.OK).json({ data: user, message: 'Success' });
    } catch (err) {
      // Handle errors and send an internal server error response
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.patch(
    '/api/v1/update_profile',
    authenticateUser,
    async (req, res, next) => {
      try {
        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const userId = req.user.userId;

        const user = await userService.getAUser({ userId: userId });

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        const { file } = req.body ? req.body : req.files;

        const data = await UploadThroughCloudinary(file);

        const editedDetials = await userService.editUserData(userId, {
          ...user,
          profile_pic: data?.secure_url,
          cloudinary_id: data?.public_id,
        });

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

  app.patch('/api/v1/edit_user', authenticateUser, async (req, res, next) => {
    try {
      if (req?.user?.status === 'inactive') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Becuase of you ADMIN Status you can not create a user.',
        });
      }

      const userId = req.body._id ? req.body._id : req.user.userId;

      const user = await userService.getAUser({ userId: userId });

      if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `user does not exit` });
      }

      if (user?.admintype === 'root_admin') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: `This user Cans't be Edited`,
        });
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const myNewPassword = await bcrypt.hash(req?.body?.password, salt);

        const editedDetials = await userService.editUserData(userId, {
          ...req.body,
          password: myNewPassword,
        });

        res
          .status(StatusCodes.OK)
          .json({ data: editedDetials, message: `success` });
      } else {
        const editedDetials = await userService.editUserData(userId, {
          ...req.body,
          ...user,
        });

        res
          .status(StatusCodes.OK)
          .json({ data: editedDetials, message: `success` });
      }
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });

  app.patch(
    '/api/v1/edit_user_password',
    authenticateUser,
    async (req, res, next) => {
      try {
        const userId = await req.user;

        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const newPassword = await bcrypt.compare(
          req.body.oldPassword,
          req?.body?.password
        );

        if (!newPassword) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Old password do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const myNewPassword = await bcrypt.hash(req?.body?.newPassword, salt);

        const editedDetials = await userService.editUserData(userId.userId, {
          ...req.user,
          password: myNewPassword,
        });

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
};
