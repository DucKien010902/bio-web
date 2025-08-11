const nodemailer = require('nodemailer');

class SendEmailController {
  async SendEmail(to, newPass) {
    console.log('Đang gửi email tới:', to);

    const subject = 'Chào bạn';
    const html = `Cảm ơn bạn đã tin tưởng và đặt lịch xét nghiệm. Mật khẩu đăng nhập theo dõi kết của xét nghiệm: <b>${newPass}</b>`;

    // ✅ Tạo transporter dùng Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kienn8438@gmail.com', // Gmail của bạn
        pass: 'faxu ajoo pgwg vttp', // Mật khẩu ứng dụng Gmail
      },
    });

    const mailOptions = {
      from: '"Hệ thống của tôi" <kienn8438@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email đã được gửi thành công!');
      return true;
    } catch (error) {
      console.error('❌ Lỗi gửi email:', error.message);
      return false;
    }
  }
}

module.exports = new SendEmailController();
