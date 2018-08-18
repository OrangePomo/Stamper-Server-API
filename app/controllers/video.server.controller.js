const Video = require('mongoose').model('Video');

exports.videoByID = (req, res, next, id) => {
  Video.findById(id, (err, video) => {
    if(err) return next(err);
    if(!video) req.video = null;
    else req.video = video;
    next();
  });
};
