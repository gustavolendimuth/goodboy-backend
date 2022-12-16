import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;

if (!host) throw new Error('EMAIL_HOST not found');

export default async (email:string, magicLink:string) => {
  const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: { 
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: '"Gustavo Lendimuth" <gustavolendimuth@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Login", // Subject line
    text: `link de login http://localhost:3000/login/${email}/${magicLink}`, // plain text body
    html: `<p>Acesse o link abaixo para fazer o login</p><a href="http://localhost:3000/login/${email}/${magicLink}">http://localhost:3000/login/${email}/${magicLink}</a>`, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

