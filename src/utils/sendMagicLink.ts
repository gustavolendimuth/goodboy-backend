import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = Number(process.env.EMAIL_PORT) || 465;
const secure = process.env.EMAIL_SECURE === 'true' || false;
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

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

