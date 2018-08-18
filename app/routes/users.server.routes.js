const users = require('../../app/controllers/users.server.controller');

module.exports = app => {
  app.route('/users')
    .post(users.signup);

  app.route('/users/:userId')
    .post(users.login);

  app.param('userId', users.userByID);  //app.route보다 먼저 실행됨
};
