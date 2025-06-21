const products = require('../model/products');
const carts = require('../model/cartsDB');
const shops = require('../model/shops');
const vnpayConfig = require('../../config/VNPayConfig');
const querystring = require('qs');
class producController {
  async getallProducts(req, res) {
    try {
      const allProducts = await products.find({});
      return res.status(200).json(allProducts);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async getProductById(req, res) {
    const { Id } = req.query;
    try {
      const Products = await products.findOne({ Id });
      return res.status(200).json(Products);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async getProductsByShop(req, res) {
    try {
      const { shopID } = req.query; // nhận mảng productIds từ body
      // console.log(productIds);
      console.log(shopID);
      const Products = await products.find({ pdShopID: shopID });
      return res.status(200).json(Products);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async fetchProductsByShopGrouped(req, res) {
    try {
      const { shopID } = req.query;

      if (!shopID) {
        return res.status(400).json({ message: 'Thiếu shopID' });
      }

      const shop = await shops.findOne({ shopID });
      if (!shop) {
        return res.status(404).json({ message: 'Không tìm thấy shop' });
      }

      const grouped = {};

      for (const category of shop.productCategories) {
        const productCodes = Array.isArray(category.productIds)
          ? category.productIds
          : [];

        const productsInCategory = await products.find({
          Id: { $in: productCodes }, // ✅ tìm theo mã sản phẩm
        });

        grouped[category.categoryName] = productsInCategory;
      }

      res.status(200).json(grouped);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo shop:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async getCarts(req, res) {
    try {
      const { phoneNumber } = req.query;
      const ownCart = await carts.findOne({ phoneNumber: phoneNumber });
      return res.status(200).json(ownCart?.cart);
    } catch (error) {
      return res.status(500).json({ message: 'Loi server' });
    }
  }
  async addtoCarts(req, res) {
    try {
      const {
        phoneNumber,
        Id,
        pdImage,
        pdName,
        pdDes,
        pdPrice,
        pdVouncher,
        pdCountSale,
        pdType,
        pdStar,
        pdDayDelivery,
        counts,
      } = req.body;
      console.log(pdType);
      if (!phoneNumber || !Id || !counts) {
        return res.status(400).json({ message: 'Thiếu dữ liệu' });
      }

      let userCart = await carts.findOne({ phoneNumber });

      if (!userCart) {
        // Nếu chưa có giỏ hàng, tạo mới
        userCart = new carts({
          phoneNumber,
          cart: [
            {
              Id,
              counts,
              pdImage,
              pdName,
              pdDes,
              pdPrice,
              pdVouncher,
              pdCountSale,
              pdType,
              pdStar,
              pdDayDelivery,
            },
          ],
        });
      } else {
        // Đã có giỏ hàng → kiểm tra sản phẩm
        const productIndex = userCart.cart.findIndex(
          (item) => item.Id === Id && item.pdType === pdType
        );

        if (productIndex !== -1) {
          // Nếu sản phẩm đã tồn tại → cộng số lượng
          userCart.cart[productIndex].counts += counts;
        } else {
          // Nếu sản phẩm chưa có → thêm mới
          userCart.cart.push({
            Id,
            counts,
            pdImage,
            pdName,
            pdDes,
            pdPrice,
            pdVouncher,
            pdCountSale,
            pdType,
            pdStar,
            pdDayDelivery,
          });
        }
      }

      await userCart.save();

      return res.status(200).json({ message: 'Thêm vào giỏ hàng thành công' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async removeFromCart(req, res) {
    try {
      const { phoneNumber, Id } = req.body;

      if (!phoneNumber || !Id) {
        return res
          .status(400)
          .json({ message: 'Thiếu email hoặc Id sản phẩm' });
      }

      // Xoá sản phẩm có Id khỏi giỏ hàng của người dùng
      const result = await carts.findOneAndUpdate(
        { phoneNumber },
        { $pull: { cart: { Id } } },
        { new: true }
      );

      if (!result) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy giỏ hàng người dùng' });
      }

      return res.status(200).json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  async createProduct(req, res) {
    try {
      const Id = req.body.Id;
      // Kiểm tra trùng Id
      const existing = await products.findOne({ Id });
      if (existing) {
        return res
          .status(400)
          .json({ message: 'Sản phẩm với ID này đã tồn tại' });
      }

      // Thêm mới nếu không trùng
      const newProduct = new products(req.body);
      await newProduct.save();
      return res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
      return res.status(500).json({ message: 'Thêm thất bại' });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updated = await products.findOneAndUpdate({ Id: id }, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy' });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: 'Cập nhật thất bại' });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await products.findOneAndDelete({ Id: id });
      return res.json({ message: 'Xoá thành công' });
    } catch (err) {
      return res.status(500).json({ message: 'Xoá thất bại' });
    }
  }
}
module.exports = new producController();
