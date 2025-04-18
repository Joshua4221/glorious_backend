import { configs } from '../config/index.js';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const { APP_PASSWORD, USER_EMAIL } = configs;

// Resolve the absolute path of the `orderTemplate.html`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, 'orderTemplate.html');

export const sendOrderEmail = async (orderDetails) => {
  try {
    // Check if the email template file exists
    await access(templatePath);

    // Read and compile the email template
    const emailTemplate = await readFile(templatePath, 'utf8');
    const template = handlebars.compile(emailTemplate);

    const html = template({
      statusClass: getStatusClass(orderDetails.status),
      orderStatus: orderDetails.status,
      customerName: orderDetails.name,
      products: orderDetails.products,
      subtotal: orderDetails.total_quantity,
      totalAmount: orderDetails.totalPrice,
      year: new Date().getFullYear(),
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      secure: true,
      port: 465,
      auth: {
        user: USER_EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Glorious Evidence Info" <${USER_EMAIL}>`,
      to: orderDetails.email,
      subject: 'Order Status Update',
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order email:', error);
  }
};

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'status-pending';
    case 'processing':
      return 'status-processing';
    case 'shipping':
      return 'status-shipping';
    case 'delivered':
      return 'status-delivered';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
};
