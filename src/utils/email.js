const nodemailer = require("nodemailer");
require("dotenv").config(); 

const sendMailToUser = async (email, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"HMS Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Mail successfully sent to", email);
  } catch (error) {
    console.log("Mail not sent:", error.message);
  }
};

module.exports = sendMailToUser;
