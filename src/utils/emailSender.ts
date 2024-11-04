import nodemailer from 'nodemailer';
import { config } from '../config/environment';

export default async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.EMAIL_USERNAME,
    to,
    subject,
    html, 
  };

  await transporter.sendMail(mailOptions);
}