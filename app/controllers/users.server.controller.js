const User = require('mongoose').model('User');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.save(err => {
    if(err) next(err);
    res.json(user);
  });
};

exports.login = (req, res, next) => {
  if(err)
    return next(err);

  if(!user){
    return res.json({
      "result" : false,
      "message" : "Unknown user"
    });
  }

  if(!user.authenticate(password)){
    return res.json({
      "result" : false,
      "message" : "Invalid password"
    });
  }

  return res.json({
    "result" : true,
    "message" : user
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
