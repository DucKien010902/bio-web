// import New from './newRoute';

const Clinic = require('./clinicRoute');
const TestType = require('./testtypeRoute');
const Users = require('./usersRoute');
const Booking = require('./bookingRoute');

function route(app) {
  app.use('/clinic', Clinic);
  app.use('/testservice', TestType);
  app.use('/users', Users);
  app.use('/booking', Booking);
}
module.exports = route;
