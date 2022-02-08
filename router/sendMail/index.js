"use strict";
const nodemailer = require("nodemailer");
const express = require("express");

const router = express.Router();

async function sendMail(data) {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
      user: "1508771379@qq.com",
      pass: "jlqfnrecqdsdjeif",
    },
  });

  let info = await transporter.sendMail({
    from: "1508771379@qq.com",
    to: "caojiaqi8@jd.com",
    subject: `${data.subject}`,
    text: `
    发件人：${data.name}
    发件人邮箱：${data.email}
    内容：${data.message}`,
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/", (req, res) => {
  let { email, message, name, subject } = req.body;

  try {
    if (email && message && name && subject) {
      sendMail(req.body)
        .then(() => {
          res.send({
            code: 1,
            msg: "邮件发送成功",
          });
        })
        .catch((err) => {
          res.send({
            code: 2,
            msg: "邮件发送成功",
          });
        });
    }
  } catch (e) {
    console.log("发送邮件失败", e);
  }
});

module.exports = router;
