import nodemailer from 'nodemailer';
import { configs } from '../config/index.js';

const { APP_PASSWORD, USER_EMAIL } = configs;
// nodemailer
export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
        user: USER_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const sentMailResponse = await transporter.sendMail({
      from: '<AbaNAba>',
      to: email,
      subject: subject,
      html: text,
    });
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};
