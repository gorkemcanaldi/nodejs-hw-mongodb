import nodemailer from 'nodemailer';
import sendinblueTransport from 'nodemailer-sendinblue-transport';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (options) => {
  const transporter = nodemailer.createTransport(
    sendinblueTransport({
      apiKey: process.env.BREVO_API_KEY,
    })
  );

  try {
    // Mail gönder
    const info = await transporter.sendMail(options);
    console.log('Mail sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Mail sending error:', error);
    throw new Error('Failed to send the email, please try again later.');
  }
};
