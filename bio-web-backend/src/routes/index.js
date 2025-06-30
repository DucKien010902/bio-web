// import New from './newRoute';

const Clinic = require('./clinicRoute');
const TestType = require('./testtypeRoute');
const Users = require('./usersRoute');
const Booking = require('./bookingRoute');
const Product = require('./productsRoute');
const Shop = require('./shopRoute');
const Order = require('./orderRoute');
const Voucher = require('./voucherRoute');
const Chat = require('./chatRoute');
function route(app) {
  app.use('/clinic', Clinic);
  app.use('/testservice', TestType);
  app.use('/users', Users);
  app.use('/booking', Booking);
  app.use('/product', Product);
  app.use('/shop', Shop);
  app.use('/order', Order);
  app.use('/voucher', Voucher);
  app.use('/chat', Chat);
}
module.exports = route;
