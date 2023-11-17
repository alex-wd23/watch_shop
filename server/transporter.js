const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "447babe7c5324a", // replace with your Mailtrap username
      pass: "0cd811c1786383" // replace with your Mailtrap password
    }
  });

  module.exports = transporter;