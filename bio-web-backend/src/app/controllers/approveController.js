// controllers/ApproveController.js
const mongoose = require('mongoose');
const Category = require('../model/categories');
const Approve = require('../model/approveDB'); // Model đề xuất

class ApproveController {
  // Lấy tất cả đề xuất hiện có
  async getAllProposed(req, res) {
    try {
      const data = await Approve.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Đề xuất thêm danh mục mới
  async proposeCategory(req, res) {
    try {
      const { name, classifies = [] } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Thiếu tên danh mục' });
      }

      // Nếu đã có trong danh mục chính → từ chối
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(409).json({ message: 'Danh mục đã tồn tại' });
      }

      // Nếu đã được đề xuất → từ chối
      const existedProposal = await Approve.findOne({ name });
      if (existedProposal) {
        return res.status(409).json({ message: 'Đã được đề xuất trước đó' });
      }

      // Lưu đề xuất mới
      const newProposal = new Approve({ name, classify: classifies });
      await newProposal.save();
      return res.status(201).json({ message: 'Đề xuất danh mục thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Đề xuất thêm phân loại vào danh mục đã có
  async proposeClassify(req, res) {
    try {
      const { name, classifies } = req.body;
      if (!name || !Array.isArray(classifies)) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
      }

      // Kiểm tra danh mục chính
      const category = await Category.findOne({ name });
      if (!category) {
        return res.status(404).json({ message: 'Danh mục không tồn tại' });
      }

      // Lọc ra các phân loại mới chưa tồn tại
      const newClassifies = classifies.filter(
        (c) => !category.classifies.includes(c)
      );

      if (newClassifies.length === 0) {
        return res.status(409).json({ message: 'Tất cả phân loại đã tồn tại' });
      }

      // Nếu đã có đề xuất → cập nhật
      const existingProposal = await Approve.findOne({ name });
      if (existingProposal) {
        await Approve.updateOne(
          { name },
          { $addToSet: { classify: { $each: newClassifies } } }
        );
      } else {
        // Nếu chưa có → tạo mới
        const newProposal = new Approve({
          name,
          classify: newClassifies,
        });
        await newProposal.save();
      }

      return res.status(201).json({ message: 'Đề xuất phân loại thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Xoá đề xuất
  async deletePropose(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Thiếu tên đề xuất' });

      const deleted = await Approve.findOneAndDelete({ name });
      if (!deleted)
        return res.status(404).json({ message: 'Không tìm thấy đề xuất' });

      return res.status(200).json({ message: 'Xoá đề xuất thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  // Phê duyệt đề xuất từ admin
  async approvePropose(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: 'Thiếu tên danh mục cần phê duyệt' });
      }

      const proposal = await Approve.findOne({ name });
      if (!proposal) {
        return res.status(404).json({ message: 'Không tìm thấy đề xuất' });
      }

      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        // Danh mục đã có, thêm phân loại nếu có phân loại mới
        const newClassifies = (proposal.classify || []).filter(
          (cls) => !existingCategory.classifies.includes(cls)
        );

        if (newClassifies.length > 0) {
          await Category.updateOne(
            { name },
            { $addToSet: { classifies: { $each: newClassifies } } }
          );
        }
      } else {
        // Danh mục chưa có, tạo mới
        const newCategory = new Category({
          name,
          classifies: proposal.classify || [],
        });
        await newCategory.save();
      }

      // Xoá đề xuất sau khi phê duyệt
      await Approve.deleteOne({ name });

      return res.status(200).json({ message: 'Phê duyệt thành công' });
    } catch (error) {
      console.error('Approve error:', error);
      return res.status(500).json({ message: 'Lỗi server khi phê duyệt' });
    }
  }

  // Xoá đề xuất (nếu chưa có)
  async deletePropose(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Thiếu tên đề xuất' });

      const deleted = await Approve.findOneAndDelete({ name });
      if (!deleted)
        return res.status(404).json({ message: 'Không tìm thấy đề xuất' });

      return res.status(200).json({ message: 'Xoá đề xuất thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new ApproveController();
