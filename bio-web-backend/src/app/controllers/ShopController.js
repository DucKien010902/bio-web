const Shops = require('../model/shops');
class ShopController {
  async fetchShopInfoByPhoneNumber(req, res) {
    try {
      const { phoneNumber } = req.query;
      const shopInfo = await Shops.findOne({ phoneNumber });
      return res.status(200).json(shopInfo);
    } catch (error) {
      return res.status(500).json({ message: 'Khong the lay thong tn shop' });
    }
  }
  async fetchShopInfoByID(req, res) {
    try {
      const { shopID } = req.query;
      const shopInfo = await Shops.findOne({ shopID });
      return res.status(200).json(shopInfo);
    } catch (error) {
      return res.status(500).json({ message: 'Khong the lay thong tn shop' });
    }
  }
  async fetchAllShop(req, res) {
    try {
      const shopInfo = await Shops.find({});
      return res.status(200).json(shopInfo);
    } catch (error) {
      return res.status(500).json({ message: 'Khong the lay thong tn shop' });
    }
  }
  async updateShop(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await Shops.findOneAndUpdate({ shopID: id }, updateData, {
        new: true,
      });

      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy shop' });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi cập nhật shop' });
    }
  }
  async updateOnlineStatus(req, res) {
    const { phoneNumber, isOnline, lastActive } = req.body;
    try {
      const shop = await Shops.findOneAndUpdate(
        { phoneNumber },
        {
          isOnline,
          ...(lastActive && { lastActive }),
        },
        { new: true }
      );
      res.json(shop);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái' });
    }
  }
}
module.exports = new ShopController();
