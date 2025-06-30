/* controllers/ChatDB.js */
const mongoose = require('mongoose');
const Chat = require('../model/chatDB');
const { v4: uuidv4 } = require('uuid');

class ChatDB {
  /* -------- GỬI TIN NHẮN -------- */
  async sendMessage(req, res) {
    try {
      const { senderID, receiverID, content, fromShop } = req.body;
      // fromShop: boolean chỉ ra sender là shop hay customer
      if (
        !senderID ||
        !receiverID ||
        !content ||
        typeof fromShop !== 'boolean'
      ) {
        return res.status(400).json({ message: 'Thiếu thông tin' });
      }

      /* (Tuỳ ứng dụng) tra cứu thông tin người gửi/người nhận để lấy tên, avatar … */
      const sender = await Employee.findOne({ userID: senderID });
      const receiver = await Employee.findOne({ userID: receiverID });

      if (!sender || !receiver) {
        return res
          .status(404)
          .json({ message: 'Người gửi/nhận không tồn tại' });
      }

      /* 1. TÌM ĐOẠN CHAT GIỮA 2 NGƯỜI (không quan trọng ai là shop trước) */
      let chat = await Chat.findOne({
        $or: [
          {
            'members.customer.userID': senderID,
            'members.shop.shopID': receiverID,
          },
          {
            'members.customer.userID': receiverID,
            'members.shop.shopID': senderID,
          },
        ],
      });

      /* 2. NẾU CHƯA TỒN TẠI ⇒ TẠO MỚI */
      if (!chat) {
        chat = new Chat({
          members: fromShop
            ? {
                shop: {
                  shopID: senderID,
                  shopName: sender.fullName,
                  avatarUrl: sender.avatarUrl,
                },
                customer: {
                  userID: receiverID,
                  userName: receiver.fullName,
                  avatarUrl: receiver.avatarUrl,
                },
              }
            : {
                shop: {
                  shopID: receiverID,
                  shopName: receiver.fullName,
                  avatarUrl: receiver.avatarUrl,
                },
                customer: {
                  userID: senderID,
                  userName: sender.fullName,
                  avatarUrl: sender.avatarUrl,
                },
              },
        });
      }

      /* 3. THÊM TIN NHẮN */
      chat.messages.push({
        id: uuidv4(),
        fromShop,
        content,
        timestamp: new Date(),
      });

      await chat.save();
      return res
        .status(200)
        .json({ message: 'Gửi thành công', chatID: chat.chatID });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
  }

  /* -------- LẤY TOÀN BỘ TIN NHẮN GIỮA 2 NGƯỜI -------- */
  async getMessage(req, res) {
    try {
      const { customerID, shopID } = req.query;
      if (!customerID || !shopID) {
        return res.status(400).json({ message: 'Thiếu customerID / shopID' });
      }

      const chat = await Chat.findOne({
        'members.customer.userID': customerID,
        'members.shop.shopID': shopID,
      });

      if (!chat) {
        return res.status(404).json({ message: 'Chưa có đoạn chat' });
      }
      return res.status(200).json(chat.messages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
  }

  /* -------- LẤY DANH SÁCH ĐOẠN CHAT CỦA 1 USER -------- */
  async getGroup(req, res) {
    try {
      const { userID } = req.query; // ID của shop hoặc customer
      if (!userID) return res.status(400).json({ message: 'Thiếu userID' });

      /* Tìm tất cả chat có userID nằm ở 1 trong 2 phía */
      const chats = await Chat.find({
        $or: [
          { 'members.customer.userID': userID },
          { 'members.shop.shopID': userID },
        ],
      });

      /* Format: lastMessage + partnerInfo */
      const formatted = chats
        .map((c) => {
          const last = c.messages.at(-1) || null;
          const partner =
            c.members.customer.userID === userID
              ? c.members.shop
              : c.members.customer;
          return {
            chatID: c.chatID,
            partner,
            lastMessage: last,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.lastMessage?.timestamp || 0) -
            new Date(a.lastMessage?.timestamp || 0)
        );

      return res.status(200).json(formatted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new ChatDB();
