import nodemailer from 'nodemailer';

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
    secure, // true for 465, false for other ports
    auth: { 
      user,
      pass 
    }
  });

  await transporter.sendMail({
    from: `"Good Boy" <${user}>`, // sender address
    to: email, // list of receivers
    subject: "Link de login", // Subject line
    text: `Link de login ${process.env.FRONTEND_URL}/login/${email}/${magicLink}`, // plain text body
    html: `<p>Acesse o link abaixo para fazer o login</p><a href="${process.env.FRONTEND_URL}/login/${email}/${magicLink}">${process.env.FRONTEND_URL}/login/${email}/${magicLink}</a>`, // html body
  });
}

