import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import mongoosePaginate from 'mongoose-paginate-v2';

const { isEmail } = validator;

// Define the schema for the User model
const AdminSchema = new mongoose.Schema(
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
    },

    // Password field with validation
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 6,
    },

    profile_pic: {
      type: String,
    },

    cloudinary_id: {
      type: String,
    },

    adminType: {
      type: String,
      enum: [
        'root_admin',
        'mid_admin',
        'order_admin',
        'product_admin',
        'normal_two_admin',
        'normal_one_admin',
      ],
      default: 'normal_admin',
    },

    blocked: {
      type: Boolean,
      default: false,
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

    about: {
      type: String,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    last_activity: { type: Date, default: Date.now },

    date: { type: Date, default: Date.now },

    usedroom: {
      type: String,
    },

    adminEmail: {
      type: String,
    },

    adminName: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware to be executed before saving a user document
AdminSchema.pre('save', function (next) {
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
AdminSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.otp;
  return userObject;
};

// Static method to find a user by credentials (email and password)
AdminSchema.statics.findByCredentials = async function (email, password) {
  const user = await AdminModel.findOne({ email }).lean();

  if (!user) throw new Error('Invalid user details');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Invalid email or password');

  if (user?.status === 'inactive') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Becuase of you ADMIN Status you can not create a user.',
    });
  }

  // Generate JWT token with user information
  const token = jwt.sign(
    { userId: user._id, fullname: user.fullname, email: user.email },
    process.env.JWT_SECRET
  );

  delete user.password;

  return [user, token];
};

AdminSchema.plugin(mongoosePaginate);
// Create the UserModel using the defined schema
const AdminModel = mongoose.model('admin', AdminSchema);

export default AdminModel;
