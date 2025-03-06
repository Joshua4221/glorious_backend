import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { authApiProvider } from './src/authSrc/auth_api/auth_api.js';
import { notFound } from './middlewares/not-found.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.js';
import { userApiProvider } from './src/authSrc/auth_api/users_api.js';
import { verificationApiProvider } from './src/authSrc/auth_api/verification_api.js';
// import whatsappClient from "./WhatsappServices.js/whatsappMajor.js";
import { businessVerificationApiProvider } from './src/verificationSrc/verification_api/businessVerification_api.js';
import { CloudinaryApiProvider } from './src/Utils/cloudinary_api.js';
import { OtpControllerApiProvider } from './src/authSrc/auth_api/otp_controller_api.js';
import { documentVerificationApiProvider } from './src/verificationSrc/verification_api/documentVerfication_api.js';
import { faceVerificationApiProvider } from './src/verificationSrc/verification_api/faceVerification_api.js';
import { ServiceApiProvider } from './src/serviceSrc/service_apis/service_api.js';
import { ServiceCategoryApiProvider } from './src/serviceSrc/service_apis/service_category_api.js';
import { adminApiProvider } from './src/adminSrc/admin_api/admin_api.js';
import { ServiceBookingsApiProvider } from './src/serviceSrc/service_apis/service_booking_api.js';
import { adminUserApiConnections } from './src/adminSrc/admin_api/admin_user_api.js';
import { BidBookingsApiProvider } from './src/serviceSrc/service_apis/bid_booking_api.js';
import { CategoryApiProvider } from './src/categoriesSrc/category_api/category_api.js';
import { SubCategoryApiProvider } from './src/categoriesSrc/category_api/subCategory_api.js';
import { ProductApiProvider } from './src/productSrc/product_api/productApi.js';
import { UserProductApiProvider } from './src/productSrc/product_api/productApi_for_user.js';
import { CartApiProvider } from './src/cartSrc/cartApi/cart_api.js';
import { SocketApiProvider } from './src/SocketSrc/socketApi/socket_api.js';
import cloudinary from './config/cloudinary.js';
import { OrderApiProvider } from './src/orderSrc/orderApi/order_api.js';
import { blogApiConnections } from './src/blogSrc/api/blog_api.js';
import { WishListApiProvider } from './src/wishListSrc/wishListApis/wish_list_api.js';

export const expressApp = async (app) => {
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
  });

  authApiProvider(app);
  userApiProvider(app);
  verificationApiProvider(app);
  OtpControllerApiProvider(app);
  businessVerificationApiProvider(app);
  documentVerificationApiProvider(app);
  faceVerificationApiProvider(app);
  CloudinaryApiProvider(app);
  ServiceApiProvider(app);
  ServiceBookingsApiProvider(app);
  ServiceCategoryApiProvider(app);
  adminApiProvider(app);
  adminUserApiConnections(app);
  BidBookingsApiProvider(app);
  CategoryApiProvider(app);
  SubCategoryApiProvider(app);
  ProductApiProvider(app);
  UserProductApiProvider(app);
  CartApiProvider(app);
  OrderApiProvider(app);
  SocketApiProvider(app);
  blogApiConnections(app);
  WishListApiProvider(app);

  app.use(notFound);

  app.use(errorHandlerMiddleware);
};
