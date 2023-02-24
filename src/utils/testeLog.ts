/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import 'dotenv/config';
import HttpException from './HttpException';

const host = process.env.EMAIL_HOST;
const port = Number(process.env.EMAIL_PORT);
const secure = process.env.EMAIL_SECURE === 'true';
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const email = process.env.ERROR_LOG_EMAIL;

if (!host) throw new HttpException(401, 'EMAIL_HOST not found');

export default async (body:any) => {
  let message = body;
  if (typeof body !== 'string') message = JSON.stringify(body);

  console.log(body);

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
    subject: 'Teste', // Subject line
    text: `Teste ${message}`, // plain text body
    html: `<h1>Teste</h1><p>${message}</p>`, // html body
  });
};
