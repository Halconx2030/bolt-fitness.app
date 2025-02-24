import nodemailer from 'nodemailer';
import { logger } from './monitoring/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    logger.info({
      event: 'email_sent',
      recipient: to,
      subject,
    });

    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    return false;
  }
}
