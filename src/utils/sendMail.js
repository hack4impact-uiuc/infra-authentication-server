const nodemailer = require("nodemailer");
async function sendMail(mail_body) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.INFRA_EMAIL,
      clientId: process.env.INFRA_CLIENT_ID,
      clientSecret: process.env.INFRA_CLIENT_SECRET,
      refreshToken: process.env.INFRA_REFRESH_TOKEN
    }
  });
  await transporter.sendMail(mail_body).catch(_ => {
    sendResponse(
      res,
      500,
      "An internal server error occured and the email could not be sent."
    );
  });
}

module.exports = { sendMail };
