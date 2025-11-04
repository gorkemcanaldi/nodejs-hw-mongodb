import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async ({ to, subject, html }) => {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log('Brevo sendMail error:', text);
      throw new Error('Failed to send email');
    }

    const data = await res.json();
    console.log('Mail sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Mail sending error:', error);
    throw new Error('Failed to send the email, please try again later.');
  }
};
