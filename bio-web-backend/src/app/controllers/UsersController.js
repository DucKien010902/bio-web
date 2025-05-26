const mongoose = require('mongoose');
const UserDB = require('../model/usersDB');

class UsersController {
  async createAccount(req, res) {
    try {
      const { phone, name, password, birthday, address } = req.body;
      if (!phone || !name || !password || !birthday || !address) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
      }

      const existingUser = await UserDB.findOne({ phone });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: 'Số điện thoại đã được đăng ký.' });
      }

      //   const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserDB({
        phone,
        name,
        password,
        birthday,
        address,
      });

      await newUser.save();

      res.status(201).json({ message: 'Tạo tài khoản thành công!' });
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
  }

  async checkAccount(req, res) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập tên và mật khẩu.' });
      }

      const user = await UserDB.findOne({ phone });

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Tên người dùng không tồn tại.' });
      }
      if (password !== user.password) {
        return res.status(401).json({ message: 'Mật khẩu không chính xác.' });
      }

      res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: user,
      });
    } catch (error) {
      console.error('Lỗi kiểm tra tài khoản:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ.' });
    }
  }
}

module.exports = new UsersController();
