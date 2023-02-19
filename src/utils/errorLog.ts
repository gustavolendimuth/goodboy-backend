import nodemailer from 'nodemailer';
import 'dotenv/config';
import HttpException from './httpException';

const host = process.env.EMAIL_HOST;
const port = Number(process.env.EMAIL_PORT);
const secure = process.env.EMAIL_SECURE === 'true';
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const email = process.env.ERROR_LOG_EMAIL;

if (!host) throw new HttpException(401, 'EMAIL_HOST not found');

export default async (err:Error) => {
  const { message, stack } = err;
  const errMessage = JSON.stringify(`<h1>${message}</h1><p>${stack?.replace(/\n/g, '<br />')}</p>`);

  console.log(err);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"Good Boy" <${user}>`, // sender address
    to: email, // list of receivers
    subject: 'Log de erro', // Subject line
    text: errMessage, // plain text body
    html: errMessage, // html body
  });
};
