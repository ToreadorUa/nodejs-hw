const nodemailer = require('nodemailer');
require("dotenv").config();


const { GMAIL_PASS } = process.env;

const nodemailerConfig = {
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "toreadorr.ua@gmail.com",
        pass: GMAIL_PASS,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (email) => {
    await transport.sendMail(email);
    console.log("Email sended success");
}

module.exports = sendEmail;