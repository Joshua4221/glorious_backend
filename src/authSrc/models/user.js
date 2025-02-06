import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const { isEmail } = validator;

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    // Email field with validation and uniqueness constraints
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      validate: [isEmail, 'invalid Email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },

    // Phone number field with uniqueness constraint
    phone_number: {
      type: String,
      // unique: true,
    },

    about: {
      type: String,
    },

    // Password field with validation
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 6,
    },

    store_name: {
      type: String,
      // unique: true,
    },

    store_description: {
      type: String,
      // unique: true,
    },

    profile_pic: {
      type: String,
    },

    cloudinary_id: {
      type: String,
    },

    vendor_type: {
      type: Boolean,
      default: false,
    },

    client_type: {
      type: Boolean,
      default: false,
    },

    business_name: { type: String },

    business_address: {
      type: String,
    },

    country: {
      type: String,
    },

    city: {
      type: String,
    },

    address: {
      type: String,
    },

    date: { type: Date, default: Date.now },

    business_type: {
      type: String,
      // Sole proprietorship, partnership, corporation, etc.
    },

    tax_identification_number: {
      type: String,
      // Tax Identification Number (TIN): For tax purposes, depending on your country.
    },

    government_id_type: {
      type: String,
      // Government ID: A copy of your driver's license, passport, or other government-issued ID.
    },

    government_id_number: {
      type: String,
      // Government ID: A copy of your driver's license, passport, or other government-issued ID.
    },

    business_license: {
      type: String,
      // Business License: Proof of your business registration.
    },

    usedroom: {
      type: String,
    },

    imageVerification: {
      type: String,
    },

    verify_phone: { type: String, default: 'pending' },

    verify_email: { type: String, default: 'pending' },

    face_verification: { type: String, default: 'pending' },

    verify_document: { type: String, default: 'pending' },

    verify_business: { type: String, default: 'pending' },

    otp: { type: String },

    phone_otp: { type: String },
  },
  { timestamps: true }
);

// Middleware to be executed before saving a user document
UserSchema.pre('save', function (next) {
  const user = this;

  // Convert email to lowercase before saving
  if (user.email) {
    user.email = user.email.toLowerCase();
  }

  // Continue with the password hashing logic
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// Method to remove sensitive information (password) from the user object before sending as JSON
UserSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.otp;
  return userObject;
};

// Static method to find a user by credentials (email and password)
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await UserModel.findOne({ email }).lean();

  if (!user) throw new Error('Invalid user or password');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Invalid email or password');

  // Generate JWT token with user information
  const token = jwt.sign(
    { userId: user._id, fullname: user.fullname, email: user.email },
    process.env.JWT_SECRET
  );

  delete user.password;

  return [user, token];
};

// Create the UserModel using the defined schema
const UserModel = mongoose.model('Users', UserSchema);

export default UserModel;

// Bank Account Information: For receiving payments.
// 5. Set Up Payment Information
// Provide details for receiving payments:

// Bank Account Details: Account number, routing number, and bank name.
// Payment Methods: Set up your preferred payment methods (PayPal, direct bank transfer, etc.).
