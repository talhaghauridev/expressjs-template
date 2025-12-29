import { env } from '@/env';
import ApiError from '@/utils/api-error';
import nodemailer, { SendMailOptions } from 'nodemailer';
import logger from './logger';

export async function sendEmail(options: SendMailOptions): Promise<any> {
  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      service: env.SMTP_SERVICE,
      auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    const mailOption: SendMailOptions = {
      from: `${env.APP_NAME} <${env.SMTP_MAIL}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOption);
    logger.info('Email sent: %s', info.messageId);
    return info;
  } catch (error: any) {
    logger.error('Error sending email:', error);
    throw ApiError.badRequest(error.message);
  }
}
