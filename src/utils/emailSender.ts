import nodemailer from 'nodemailer';

export default async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}
