import { StatusCodes } from 'http-status-codes';
import { adminAuthenticateUser } from '../../../utils/adminAuthentication.js';
import AdminUserService from '../admin_services/admin_user_services.js';
import bcrypt from 'bcrypt';
import AdminModel from '../admin_models/admin_models.js';
import { UploadThroughCloudinary } from '../../../utils/updateToCloudinary.js';

const options = {
  page: 1,
  limit: 2,
  lean: true,
  select: '-password',
  collation: {
    locale: 'en',
  },
};

export const adminUserApiConnections = (app) => {
  const adminUserService = new AdminUserService();

  app.get(
    '/api/v1/get_admin_user',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const userId = await req.user;

        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const user = await adminUserService.getUserData(req.user);

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        res.status(StatusCodes.OK).json({ data: user, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.get(
    '/api/v1/single_admin/:Id',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { Id } = await req.params;

        const user = await adminUserService.getUserData({ userId: Id });

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        if (user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not get this user.',
          });
        }

        res.status(StatusCodes.OK).json({ data: user, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.patch(
    '/api/v1/admin_edit_user',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        if (
          req?.user?.adminType === 'mid_admin' &&
          req?.body?.adminType === 'root_admin'
        ) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Level you can not edit this user',
          });
        }

        if (req?.user?.adminType === 'normal_admin') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Level you can not edit this user',
          });
        }

        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const userId = req.body._id ? req.body._id : req.user.userId;

        // const user = await adminUserService.getUserData({ userId: userId });

        if (req?.body?.adminType === 'root_admin') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: `This user Cans't be Edited`,
          });
        }

        console.log(req.body, 'season of work');

        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          const myNewPassword = await bcrypt.hash(req?.body?.password, salt);

          const editedDetials = await adminUserService.editUserData(userId, {
            ...req.body,
            password: myNewPassword,
          });

          if (!editedDetials) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: `user does not exit` });
          }

          res
            .status(StatusCodes.OK)
            .json({ data: editedDetials, message: `success` });
        } else {
          const editedDetials = await adminUserService.editUserData(userId, {
            ...req.body,
          });

          if (!editedDetials) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: `user does not exit` });
          }

          res
            .status(StatusCodes.OK)
            .json({ data: editedDetials, message: `success` });
        }
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );

  app.patch(
    '/api/v1/admin_update_profile',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const userId = req.user.userId;

        const user = await adminUserService.getUserData({ userId: userId });

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        const { file } = req.body ? req.body : req.files;

        const data = await UploadThroughCloudinary(file);

        const editedDetials = await adminUserService.editUserData(userId, {
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

  app.post(
    '/api/v1/admin_delete_user',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const userId = req.body.id;

        const user = await adminUserService.getUserData({ userId: userId });

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        if (user?.adminType === 'root_admin') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: `This user Cans't be deleted`,
          });
        }

        if (
          req?.user?.adminType === 'mid_admin' &&
          req?.admintype === 'root_admin'
        ) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Level you can not delete this user',
          });
        }

        if (req?.user?.adminType === 'normal_admin') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Level you can not delete this user',
          });
        }

        if (req?.user?.status === 'inactive') {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Becuase of you ADMIN Status you can not create a user.',
          });
        }

        const editedDetials = await adminUserService.deleteUserData(userId);

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

  app.patch(
    '/api/v1/admin_edit_user_password',
    adminAuthenticateUser,
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

        const editedDetials = await adminUserService.editUserData(
          userId.userId,
          { ...req.user, password: myNewPassword }
        );

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
    '/api/v1/admin_get_all_registered_users/:page/:limit',
    async (req, res, next) => {
      try {
        const { page, limit } = await req.params;

        const getAllUsers = await AdminModel.paginate(
          {},
          { ...options, page: page, limit: limit }
        );

        res
          .status(StatusCodes.OK)
          .json({ data: getAllUsers, message: 'success' });
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  );

  app.get(
    '/api/v1/admin_search_for_user/:name/:limit',
    adminAuthenticateUser,
    async (req, res, next) => {
      try {
        const { name, limit } = await req.params;

        const users = await adminUserService.SearchUserData(username, limit);

        if (!users) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: `user does not exit` });
        }

        res.status(StatusCodes.OK).json({ data: users, message: `success` });
      } catch (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      }
    }
  );
};
