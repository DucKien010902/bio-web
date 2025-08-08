const express = require('express');
const nodemailer = require('nodemailer');
class SendEmailController {
  async SendEmail(req, res) {
    console.log('da toi day');
    const to = 'nguyenviethung6177@gmail.com';
    const subject = 'Chao ban';
    const html = 'Chào HÙng cute';

    // ✅ Tạo transporter dùng Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kienn8438@gmail.com', // <--- THAY bằng Gmail của bạn
        pass: 'faxu ajoo pgwg vttp', // <--- THAY bằng mật khẩu ứng dụng (16 ký tự)
      },
    });

    const mailOptions = {
      from: '"Hệ thống của tôi" kienn8438@gmail.com',
      to: to, // người nhận
      subject: subject, // tiêu đề
      html: html, // nội dung HTML
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: 'Email đã được gửi!' });
    } catch (error) {
      return res.json({ success: false, error: error.message });
    }
  }
}
module.exports = new SendEmailController();
