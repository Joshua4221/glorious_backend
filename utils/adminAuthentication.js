import jwt from 'jsonwebtoken';
// const { UnauthenticatedError } = require("../errors");
import { StatusCodes } from 'http-status-codes';
import AdminModel from '../src/adminSrc/admin_models/admin_models.js';

export const adminAuthenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'please login or create and account' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await AdminModel.findById({ _id: payload.userId }).lean();

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Please Login or User does not exist or create and account',
      });
    }

    delete user.password;

    req.user = {
      userId: payload.userId,
      ...user,
    };

    next();
  } catch (err) {
    // throw new UnauthenticatedError("Authentication invalid");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
