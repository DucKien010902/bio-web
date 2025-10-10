// controllers/LarkController.js
const axios = require('axios');
const {
  exchangeCodeForUserToken,
  getTenantToken,
} = require('../service/larkAuth');

// Hàm đệ quy bên ngoài class
async function fetchDepartmentsRecursive(parentId = '0', token) {
  const all = [];

  let hasMore = true;
  let pageToken = null;

  while (hasMore) {
    const r = await axios.get(
      'https://open.larksuite.com/open-apis/contact/v3/departments',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page_size: 50,
          parent_department_id: parentId,
          page_token: pageToken,
        },
      }
    );

    const data = r.data.data || {};
    const items = data.items || [];

    for (const dept of items) {
      // Đệ quy lấy con
      const children = await fetchDepartmentsRecursive(
        dept.open_department_id,
        token
      );
      all.push({ ...dept, children });
    }

    hasMore = data.has_more;
    pageToken = data.page_token;
  }

  return all;
}

class LarkController {
  async oauthCallback(req, res) {
    try {
      const { code } = req.query;
      if (!code) return res.status(400).json({ message: 'Thiếu code' });

      const tokenData = await exchangeCodeForUserToken(code);
      return res.json({ message: 'Lấy user token thành công', tokenData });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // ✅ Lấy toàn bộ phòng ban (cây đầy đủ)
  async getAllDepartments(req, res) {
    try {
      const token = await getTenantToken();
      const tree = await fetchDepartmentsRecursive('0', token);
      return res.json({
        message: 'Lấy toàn bộ phòng ban thành công',
        data: tree,
      });
    } catch (err) {
      console.error(
        '❌ getAllDepartments error:',
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: 'Lỗi khi lấy toàn bộ phòng ban',
        error: err.response?.data || err.message,
      });
    }
  }

  // ✅ Lấy 1 tầng phòng ban
  async getDepartments(req, res) {
    try {
      const token = await getTenantToken();
      console.log(token);
      const r = await axios.get(
        'https://open.larksuite.com/open-apis/contact/v3/departments',
        {
          headers: { Authorization: `Bearer ${token}` },
          // params: {
          //   page_size: 50,
          //   parent_department_id: '0',
          //   fetch_child: true,
          // },
        }
      );

      return res.json(r.data);
    } catch (err) {
      console.error(
        '❌ getDepartments error:',
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: 'Lỗi khi lấy phòng ban',
        error: err.response?.data || err.message,
      });
    }
  }

  // ✅ Lấy user theo phòng ban
  async getUsersByDepartment(req, res) {
    try {
      const { deptId } = req.query;
      if (!deptId) return res.status(400).json({ message: 'Thiếu deptId' });

      const token = await getTenantToken();
      const r = await axios.get(
        'https://open.larksuite.com/open-apis/contact/v3/users/find_by_department',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { department_id: deptId, page_size: 100 },
        }
      );

      return res.json(r.data);
    } catch (err) {
      console.error(
        '❌ getUsersByDepartment error:',
        err.response?.data || err.message
      );
      return res.status(500).json({
        message: 'Lỗi khi lấy user',
        error: err.response?.data || err.message,
      });
    }
  }
}

module.exports = new LarkController();
