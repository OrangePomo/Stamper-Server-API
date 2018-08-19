const User = require('mongoose').model('User');

exports.signup = (req, res, next) => {
  const user = new User(req.body);
  user.profileUrl = 'http://52.79.250.237:3000/profile/'+user._id+'.png';
  user.save(err => {
    if(err) next(err);
    res.json(user);
  });
};

exports.login = (req, res, next) => {
  if(!req.user){
    return res.json({
      "result" : false,
      "message" : "Unknown user"
    });
  }

  if(!req.user.authenticate(req.body.password)){
    return res.json({
      "result" : false,
      "message" : "Invalid password"
    });
  }

  return res.json({
    "result" : true,
    "message" : req.user
  });
};

exports.userList = (req, res, next) => {
  User.find({})
    .exec((err, users) => {
      if(err) return next(err);
      return res.json(users);
    });
};

exports.getUser = (req, res, next) => {
  return res.json(req.user);
};

exports.userByID = (req, res, next, id) => {
  User.findById(id, (err, user) => {
    if(err) return next(err);
    if(!user) req.user = null;
    else req.user = user;
    next();
  });
};

exports.deleteAll = (req, res, next) => {
  User.remove({}, err => {
    if(err) return next(err);
    res.json({
      "result" : true,
      "message" : "delete all users"
    });
  });
};
