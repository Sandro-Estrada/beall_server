const { activateAccount } = require("../constants/emailsThemplates");
const nodemailer = require("nodemailer");

const sendEmailCode = async (code, to) => {
  const template = activateAccount(code);
  return await sendEmail(template, { subject: "Código de activación", to });
};

const sendEmail = async (template, emailData) => {
  const { subject = "Código de activación", to } = emailData;
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html: template, // html body
  });
  console.log(info,"-----------------------------------------------")
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return Boolean(info.accepted.length)
};

module.exports = { sendEmailCode };
