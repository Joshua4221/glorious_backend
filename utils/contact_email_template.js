import nodemailer from 'nodemailer';
import { configs } from '../config/index.js';

const { APP_PASSWORD, USER_EMAIL } = configs;
// nodemailer
export const sendContactEmail = async (email, name, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      secure: true,
      auth: {
        user: USER_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const sentMailResponse = await transporter.sendMail({
      from: `${name} <${email}>`,
      to: email,
      subject: subject,
      text: message,
      replyTo: email,
    });
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};
// subject: `New Contact Form Submission from ${name}`,
