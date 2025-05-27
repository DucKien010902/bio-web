const Test = require('../model/testsDB');

class TestTypeController {
  // Lấy tất cả loại xét nghiệm
  async fetchAll(req, res) {
    try {
      const response = await Test.find({});
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // ✅ Thêm một gói mới vào typeName
  async addPackage(req, res) {
    const { typeName } = req.params;
    const newPackage = req.body;

    try {
      const testType = await Test.findOne({ typeName });

      if (!testType) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy loại xét nghiệm' });
      }

      // Kiểm tra trùng code
      const exists = testType.packages.find(
        (pkg) => pkg.code === newPackage.code
      );
      if (exists) {
        return res.status(400).json({ message: 'Mã gói đã tồn tại' });
      }

      testType.packages.unshift(newPackage);
      await testType.save();

      return res.status(200).json({ message: 'Thêm gói thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // ✅ Sửa thông tin gói theo code trong typeName
  async updatePackage(req, res) {
    const { typeName, code } = req.params; // đúng params
    const updateData = req.body;

    try {
      const testType = await Test.findOne({ typeName });

      if (!testType) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy loại xét nghiệm' });
      }

      const index = testType.packages.findIndex((pkg) => pkg.code === code);
      if (index === -1) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy gói để cập nhật' });
      }

      testType.packages[index] = {
        ...testType.packages[index],
        ...updateData,
      };
      await testType.save();

      return res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // ✅ Xoá gói theo code trong typeName
  async deletePackage(req, res) {
    const { typeName, code } = req.params;

    try {
      const testType = await Test.findOne({ typeName });

      if (!testType) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy loại xét nghiệm' });
      }

      const initialLength = testType.packages.length;
      testType.packages = testType.packages.filter((pkg) => pkg.code !== code);

      if (testType.packages.length === initialLength) {
        return res.status(404).json({ message: 'Không tìm thấy gói để xoá' });
      }

      await testType.save();
      return res.status(200).json({ message: 'Xoá gói thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new TestTypeController();
