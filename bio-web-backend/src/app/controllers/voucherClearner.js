const cron = require('node-cron');
const Voucher = require('../model/voucherDB');
const UserVoucher = require('../model/voucherOfUser');

async function cleanExpiredVouchers() {
  const now = new Date();
  console.log(`[VoucherCleaner] Running at ${now.toISOString()}`);
  try {
    const expiredVoucher = await Voucher.find({ expiry: { $lt: now } });
    const expiredUserVoucher = await UserVoucher.find({ expiry: { $lt: now } });

    console.log(
      `[VoucherCleaner] Found: Voucher=${expiredVoucher.length}, UserVoucher=${expiredUserVoucher.length}`
    );

    const delVoucher = await Voucher.deleteMany({ expiry: { $lt: now } });
    const delUserVoucher = await UserVoucher.deleteMany({
      expiry: { $lt: now },
    });

    console.log(
      `[VoucherCleaner] Deleted: Voucher=${delVoucher.deletedCount}, UserVoucher=${delUserVoucher.deletedCount}`
    );
  } catch (err) {
    console.error('[VoucherCleaner] Error:', err.message);
  }
}

function startVoucherCleaner() {
  console.log('[VoucherCleaner] Starting...');

  // 👉 Chạy NGAY khi server start
  cleanExpiredVouchers();

  // 👉 Sau đó, cứ mỗi 2 tiếng lại chạy lại
  cron.schedule('0 0 */2 * * *', () => {
    cleanExpiredVouchers();
  });

  console.log('[VoucherCleaner] Cron job scheduled (every 2 hours)');
}

module.exports = startVoucherCleaner;
