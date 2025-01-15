import nodemailer from 'nodemailer';
import errorLog from './errorLog';

const host = process.env.EMAIL_HOST;
const port = Number(process.env.EMAIL_PORT);
const secure = process.env.EMAIL_SECURE === 'true';
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!host) throw new Error('EMAIL_HOST not found');

export default async (email:string, magicLink:string) => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { 
      user,
      pass 
    },
    tls: {
      rejectUnauthorized: false,
      ciphers:'SSLv3'
    }
  });

  try {
    await transporter.verify();
    
    await transporter.sendMail({
      from: `"Good Boy" <${user}>`,
      to: email,
      subject: "Link de login",
      text: `Link de login ${process.env.FRONTEND_URL}/login/${email}/${magicLink}`,
      html: `<p>Acesse o link abaixo para fazer o login</p><a href="${process.env.FRONTEND_URL}/login/${email}/${magicLink}">${process.env.FRONTEND_URL}/login/${email}/${magicLink}</a>`,
    });
  } catch (error) {
    errorLog({ error: error as Error });
    throw error;
  }
}

