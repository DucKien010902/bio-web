const mongoose = require('mongoose');
const Category = require('../model/categories');

class CategoryController {
  // Lấy tất cả danh mục
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find({});
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Thêm danh mục mới
  async addCategory(req, res) {
    try {
      const { name, classifies = [] } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Thiếu tên danh mục' });
      }

      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(409).json({ message: 'Danh mục đã tồn tại' });
      }

      const newCategory = new Category({ name, classifies });
      await newCategory.save();
      return res
        .status(201)
        .json({ message: 'Thêm danh mục thành công', data: newCategory });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Xóa danh mục theo tên
  async deleteCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ message: 'Thiếu tên danh mục để xóa' });

      const deleted = await Category.findOneAndDelete({ name });
      if (!deleted)
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });

      return res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Thêm phân loại vào danh mục
  async addClassify(req, res) {
    try {
      const { name, classify } = req.body;
      if (!name || !classify)
        return res
          .status(400)
          .json({ message: 'Thiếu tên danh mục hoặc phân loại' });

      const updated = await Category.findOneAndUpdate(
        { name },
        { $addToSet: { classifies: classify } },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });

      return res
        .status(200)
        .json({ message: 'Thêm phân loại thành công', data: updated });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Xóa phân loại khỏi danh mục
  async removeClassify(req, res) {
    try {
      const { name, classify } = req.body;
      if (!name || !classify)
        return res
          .status(400)
          .json({ message: 'Thiếu tên danh mục hoặc phân loại' });

      const updated = await Category.findOneAndUpdate(
        { name },
        { $pull: { classifies: classify } },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });

      return res
        .status(200)
        .json({ message: 'Xóa phân loại thành công', data: updated });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Lấy phân loại theo danh mục
  async getClassifiesByCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Thiếu tên danh mục' });

      const category = await Category.findOne({ name });
      if (!category)
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });

      return res.status(200).json({ classifies: category.classifies });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
  // Tạo hoặc cập nhật danh mục (nếu đã tồn tại thì thêm phân loại mới)
  async createOrUpdateCategory(req, res) {
    try {
      const { name, classifies = [] } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Thiếu tên danh mục' });
      }

      const category = await Category.findOne({ name });

      if (category) {
        // Nếu danh mục đã tồn tại, thêm phân loại mới không trùng
        const newClassifies = classifies.filter(
          (cls) => !category.classifies.includes(cls)
        );

        if (newClassifies.length > 0) {
          await Category.updateOne(
            { name },
            { $addToSet: { classifies: { $each: newClassifies } } }
          );
        }

        return res
          .status(200)
          .json({ message: 'Đã cập nhật danh mục với phân loại mới' });
      } else {
        // Danh mục chưa có, tạo mới
        const newCategory = new Category({ name, classifies });
        await newCategory.save();
        return res
          .status(201)
          .json({ message: 'Đã tạo danh mục mới thành công' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server khi tạo/cập nhật' });
    }
  }
}

module.exports = new CategoryController();
