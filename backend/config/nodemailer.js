import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER, // 你的寄件 gmail
    pass: process.env.MAIL_PASS, // app password
  },
});
