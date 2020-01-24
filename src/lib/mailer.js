const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "94e92f77cdf2c8",
    pass: "f752661d04099b"
  }
});