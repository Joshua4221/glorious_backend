import { StatusCodes } from 'http-status-codes';
import { sendContactEmail } from '../../utils/contact_email_template.js';

export const ContactApiProvider = (app) => {
  app.post('/api/v1/contact_us', async (req, res, next) => {
    try {
      const { firstName, lastName, email, message, phone_number } = req.body;

      if (!firstName || !email || !message) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message:
            'Please make sure First Name, Last Name, email, message are provided',
        });
      }

      await sendContactEmail(
        email,
        `${firstName} ${lastName}`,
        `New Contact Form Submission from ${firstName} ${lastName}`,
        message
      );

      // Return success response
      res.status(StatusCodes.OK).send({ message: 'success' });
    } catch (err) {
      // Handle errors
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  });
};
