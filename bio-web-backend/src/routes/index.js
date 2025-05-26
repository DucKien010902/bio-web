// import New from './newRoute';

const Clinic = require('./clinicRoute');
const TestType = require('./testtypeRoute');
const Users = require('./usersRoute');

function route(app) {
  app.use('/clinic', Clinic);
  app.use('/testservice', TestType);
  app.use('/users', Users);
}
module.exports = route;
