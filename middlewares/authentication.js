const UserModel = require("../models/auth");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById({ _id: payload.userId });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).send("go login again please");
    }

    req.user = {
      userId: payload.userId,
      fullname: user?.fullname,
      username: user?.username,
      email: user?.email,
      profile_pic: user?.profile_pic,
      cloudinary_id: user?.cloudinary_id,
      password: user?.password,
      // admin: user?.admin ? user?.admin : "not",
    };

    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
