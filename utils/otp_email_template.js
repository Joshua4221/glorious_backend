import nodemailer from 'nodemailer';
import { configs } from '../config/index.js';

const { APP_PASSWORD, USER_EMAIL } = configs;
// nodemailer
export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      secure: true,
      port: 465,
      auth: {
        user: USER_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const sentMailResponse = await transporter.sendMail({
      from: `"Glorious Evidence Info" <${USER_EMAIL}>`,
      to: email,
      subject: subject,
      html: text,
    });
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};
