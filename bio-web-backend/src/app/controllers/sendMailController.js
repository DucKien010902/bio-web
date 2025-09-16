const nodemailer = require('nodemailer');

class SendEmailController {
  async SendEmail(to, data, newPass) {
    console.log('Đang gửi email tới:', to);

    const subject = 'Xác nhận đặt lịch xét nghiệm';

    // HTML template đẹp, có bảng thông tin
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1677ff;">✅ Cảm ơn bạn đã đặt lịch tại GenNovaX</h2>
      <p>Dưới đây là thông tin chi tiết đơn đặt lịch của bạn:</p>

      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Họ và tên</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.name}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Ngày sinh</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.dob}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Số điện thoại</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.phone}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Email</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.email}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Địa chỉ</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.location}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Ngày xét nghiệm</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.date}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Giờ xét nghiệm</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.time}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Cơ sở</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.facility}</td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd; padding:8px; font-weight: bold;">Dịch vụ</td>
          <td style="border:1px solid #ddd; padding:8px;">${data.serviceName}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        🔑 <b>Mật khẩu để đăng nhập và theo dõi kết quả xét nghiệm:</b>
        <span style="color:#d9534f; font-size:16px;">${newPass}</span>
      </p>

      <p style="margin-top:20px; font-size:13px; color:#888;">
        Vui lòng giữ bí mật thông tin này và không chia sẻ cho người khác.<br/>
        Trân trọng,<br/>
        <b>GenNovaX</b>
      </p>
    </div>
  `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kienn8438@gmail.com',
        pass: 'faxu ajoo pgwg vttp',
      },
    });

    const mailOptions = {
      from: '"GenNovaX" <kienn8438@gmail.com>',
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
