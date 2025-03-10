import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: [true, 'Please provide email'],
    },

    phone_number: {
      type: String,
    },

    message: { type: String },
  },
  { timestamps: true }
);

const ContactModel = mongoose.model('contact', ContactSchema);

export default ContactModel;
