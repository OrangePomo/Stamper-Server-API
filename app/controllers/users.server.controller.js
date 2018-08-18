const User = require('mongoose').model('User');
const config = require('../../config/config');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.save(err => {
    if(err) next(err);
    res.json(user);
  });
};

exports.userByID = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if(err) return next(err);
    if(!user) req.user = null;
    else req.user = user;
    next();
  });
};