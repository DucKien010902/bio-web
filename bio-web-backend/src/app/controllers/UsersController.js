const mongoose = require('mongoose');
const UserDB = require('../model/usersDB');
const usersDB = require('../model/usersDB');

class UsersController {
  async createAccount(req, res) {
    try {
      const { phoneNumber, name, password, birthday, address } = req.body;
      if (!phoneNumber || !name || !password || !birthday || !address) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
      }

      const existingUser = await UserDB.findOne({ phoneNumber });
      if (existingUser) {
        return res
          .status(409)
          .json({ message: 'Số điện thoại đã được đăng ký.' });
      }

      //   const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserDB({
        phoneNumber,
        fullName,
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
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập tên và mật khẩu.' });
      }

      const user = await UserDB.findOne({ phoneNumber });

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
  async getAccount(req, res) {
    try {
      const { phoneNumber } = req.query;
      const existingUser = await usersDB.findOne({ phoneNumber });
      return res.status(200).json(existingUser);
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
  async updateImage(req, res) {
    try {
      const { phoneNumber, type, base64 } = req.body;
      console.log(type, ': ', base64);
      const existingUser = await usersDB.findOne({ phoneNumber });
      existingUser[type] = base64;
      await existingUser.save();
      return res.status(200).json({ message: 'Cap nhat anh thanh cong' });
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async updateAccount(req, res) {
    try {
      console.log(req.body);
      const {
        university,
        address,
        comefrom,
        relation,
        phone,
        company,
        highschool,
        birthday,
        gender,
        family,
        bio,
        national,
        action,
        email,
      } = req.body;
      console.log('Toi day roi');
      const existingUser = await usersDB.findOne({ phoneNumber: phone });
      if (!existingUser) {
        console.log('khong ton tai tai khoan');
      } else {
        // console.log(existingUser);
        await usersDB.updateOne(
          { phoneNumber: phone },
          {
            $set: {
              university,
              address,
              comefrom,
              relation,
              phoneNumber: phone,
              company,
              highschool,
              birthday,
              gender,
              family,
              bio,
              national,
              action,
            },
          }
        );
        return res
          .status(200)
          .json({ message: 'Cập nhật thông tin thành công' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Loi he thong' });
    }
  }
}

module.exports = new UsersController();
