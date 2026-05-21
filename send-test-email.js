// send-test-email.js
// Simple nodemailer test that reads SMTP config from .env and sends a test email
require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTest() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
  const secure = (process.env.EMAIL_SECURE || process.env.SMTP_SECURE || 'false') === 'true';

  if (!host || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing EMAIL_HOST / EMAIL_USER / EMAIL_PASS in .env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('SMTP connection successful');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Mela Celebrations — SMTP Test',
      text: 'This is a test email sent from the local SMTP test script.'
    });

    console.log('Message sent:', info.messageId || info.response);
    process.exit(0);
  } catch (err) {
    console.error('Error sending test email:');
    console.error(err);
    process.exit(1);
  }
}

sendTest();
